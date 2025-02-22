import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

export class UserService {
  // Fetch all users
  static async getAllUsers() {
    return db.select().from(users);
  }

  // Fetch a single user by ID
  static async getUserById(userId: number) {
    const user = await db.select().from(users).where(eq(users.id, userId));
    return user[0] || null; // Return the first user or null if not found
  }

  // create a get user by email function
  static async getUserByEmail(email: string) {
    const user = await db.select().from(users).where(eq(users.email, email));
    return user[0] || null; // Return the first user or null if not found
  }

  // Create a new user
  static async createUser(username: string, email: string, password: string) {
    const newUser = await db
      .insert(users)
      .values({ username, email, password })
      .returning();
    return newUser[0]; // Return the created user
  }

  // Update a user
  static async updateUser(
    userId: number,
    username: string,
    email: string,
    password: string
  ) {
    const updatedUser = await db
      .update(users)
      .set({ username, email, password })
      .where(eq(users.id, userId))
      .returning();
    return updatedUser[0]; // Return the updated user
  }

  // Delete a user
  static async deleteUser(userId: number) {
    await db.delete(users).where(eq(users.id, userId));
    return { message: "User deleted successfully" };
  }
}
