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
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

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
  // User operations
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

  async authenticateUser(credentials: LoginCredentials): Promise<User | null> {
    const user = await this.getUserByUsername(credentials.username);
    if (user && user.password === credentials.password) {
      return user;
    }
    return null;
  }

  // Game operations
  async getGames(): Promise<Game[]> {
    return await db.select().from(games);
  }

  async createGame(gameData: InsertGame): Promise<Game> {
    const [game] = await db.insert(games).values(gameData).returning();
    return game;
  }

  // User game session operations
  async getUserGameSessions(userId: string): Promise<(UserGameSession & { game: Game })[]> {
    const results = await db
      .select({
        id: userGameSessions.id,
        userId: userGameSessions.userId,
        gameId: userGameSessions.gameId,
        playtime: userGameSessions.playtime,
        lastPlayed: userGameSessions.lastPlayed,
        createdAt: userGameSessions.createdAt,
        game: games,
      })
      .from(userGameSessions)
      .leftJoin(games, eq(userGameSessions.gameId, games.id))
      .where(eq(userGameSessions.userId, userId))
      .orderBy(desc(userGameSessions.lastPlayed))
      .limit(10);
    
    return results.filter(result => result.game !== null) as (UserGameSession & { game: Game })[];
  }

  async createUserGameSession(sessionData: InsertUserGameSession): Promise<UserGameSession> {
    const [session] = await db.insert(userGameSessions).values(sessionData).returning();
    return session;
  }

  async updateUserStats(userId: string, stats: { gamesPlayed?: number; hoursPlayed?: number }): Promise<void> {
    await db
      .update(users)
      .set({
        ...stats,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
  }
}

export const storage = new DatabaseStorage();
