import {
  users,
  games,
  userGameSessions,
  type User,
  type InsertUser,
  type Game,
  type UserGameSession,
  type InsertGame,
  type InsertUserGameSession,
  type LoginCredentials,
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  authenticateUser(credentials: LoginCredentials): Promise<User | null>;

  // Game operations
  getGames(): Promise<Game[]>;
  createGame(game: InsertGame): Promise<Game>;

  // User game session operations
  getUserGameSessions(userId: string): Promise<(UserGameSession & { game: Game })[]>;
  createUserGameSession(session: InsertUserGameSession): Promise<UserGameSession>;
  updateUserStats(userId: string, stats: { gamesPlayed?: number; hoursPlayed?: number }): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // -------- Users --------
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  /**
   * Authenticate against Railway `users` table and return essentials + JSONB `data`.
   */
  async authenticateUser(credentials: LoginCredentials): Promise<User | null> {
    try {
      const result = await pool.query(
        `
        SELECT id, username, password_hash, roblox_user_id, data
        FROM users
        WHERE username = $1 AND password_hash = $2
        LIMIT 1
        `,
        [credentials.username, credentials.password]
      );

      if (result.rows.length === 0) return null;

      const p = result.rows[0] as {
        id: number;
        username: string;
        password_hash: string;
        roblox_user_id: number | null;
        data: any | null; // JSONB
      };

      // Do not leak password_hash to callers
      const user: User = {
        id: String(p.id),
        username: p.username,
        robloxUserId: p.roblox_user_id ? String(p.roblox_user_id) : null,
        data: p.data ?? null,
      } as User;

      return user;
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  // -------- Games --------
  async getGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async createGame(gameData: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(gameData).returning();
    return game;
  }

  // -------- User Game Sessions --------
  async getUserGameSessions(userId: string): Promise<(UserGameSession & { game: Game })[]> {
    // rows: { userGameSessions: UserGameSession; games: Game | null }[]
    const rows = await db
      .select()
      .from(userGameSessions)
      .leftJoin(games, eq(userGameSessions.gameId, games.id))
      .where(eq(userGameSessions.userId, userId))
      .orderBy(desc(userGameSessions.lastPlayed))
      .limit(10);

    return rows
      .filter((r) => r.games) // keep only rows with a joined game
      .map((r) => ({
        ...r.userGameSessions,
        game: r.games as Game,
      }));
  }

  async createUserGameSession(sessionData: InsertUserGameSession): Promise<UserGameSession> {
    const [session] = await db.insert(userGameSessions).values(sessionData).returning();
    return session;
  }

  /**
   * For now, just bump updatedAt (avoid writing into JSONB until you want to).
   * If you decide to update JSON paths (e.g., data->'Core'->'HoursPlayed'),
   * we can add a jsonb_set(...) update here.
   */
  async updateUserStats(userId: string, _stats: { gamesPlayed?: number; hoursPlayed?: number }): Promise<void> {
    await db.update(users).set({ updatedAt: new Date() }).where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
