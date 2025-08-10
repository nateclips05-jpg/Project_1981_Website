import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Force use of Railway database
const databaseUrl = process.env.RAILWAY_DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    "RAILWAY_DATABASE_URL must be set. Make sure you've added your Railway database connection string to secrets.",
  );
}

console.log("Using Railway database connection...");

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});
export const db = drizzle(pool, { schema });