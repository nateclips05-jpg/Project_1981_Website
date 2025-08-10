import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  integer,
  text,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for custom auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Roblox players table - connects to your existing player database
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  robloxUserId: varchar("roblox_user_id").unique(), // Roblox user ID
  username: varchar("username").unique().notNull(), // Roblox username
  displayName: varchar("display_name").notNull(),
  password: varchar("password").notNull(), // For authentication
  profileImageUrl: varchar("profile_image_url"),
  level: integer("level").default(1),
  xp: integer("xp").default(0),
  rank: varchar("rank").default('Bronze I'),
  title: varchar("title").default('New Player'),
  gamesPlayed: integer("games_played").default(0),
  hoursPlayed: integer("hours_played").default(0),
  friendsCount: integer("friends_count").default(0),
  achievements: integer("achievements").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Game records table
export const games = pgTable("games", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  genre: varchar("genre").notNull(),
  thumbnail: varchar("thumbnail"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User game sessions table
export const userGameSessions = pgTable("user_game_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  gameId: varchar("game_id").notNull().references(() => games.id),
  playtime: integer("playtime").default(0), // in minutes
  lastPlayed: timestamp("last_played").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  robloxUserId: true,
  username: true,
  displayName: true,
  password: true,
  profileImageUrl: true,
});

export const loginSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type InsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Game = typeof games.$inferSelect;
export type UserGameSession = typeof userGameSessions.$inferSelect;
export type InsertGame = typeof games.$inferInsert;
export type InsertUserGameSession = typeof userGameSessions.$inferInsert;
export type LoginCredentials = z.infer<typeof loginSchema>;
