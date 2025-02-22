import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Define the Tasks table with a foreign key to Users
export const tasks = sqliteTable("tasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("pending"),
  userId: integer("user_id")
    .references(() => users.id)
    .notNull(),
});

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
}); // users to be updated
