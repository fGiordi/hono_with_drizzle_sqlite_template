import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import "dotenv/config";

const sqlite = new Database(process.env.DATABASE!);
sqlite.exec('PRAGMA foreign_keys = ON;'); // Enable foreign key constraints

export const db = drizzle(sqlite);