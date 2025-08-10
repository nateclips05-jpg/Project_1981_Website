import {
  users,
  games,
  userGameSessions,
  type User,
  type UpsertUser,
  type Game,
  type UserGameSession,
  type InsertGame,
  type InsertUserGameSession,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  // (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
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
  // (IMPORTANT) these user operations are mandatory for Replit Auth.

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        username: userData.username || userData.email?.split('@')[0] || 'player',
        displayName: userData.displayName || userData.firstName || userData.username || 'New Player',
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
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
    return await db
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
