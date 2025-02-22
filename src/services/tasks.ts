import { db } from "../db";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";

export class TaskService {
  // Fetch tasks by userId
  static async getTasksByUserId(userId: number) {
    return db.select().from(tasks).where(eq(tasks.userId, userId));
  }

  // Fetch all tasks
  static async getAllTasks() {
    return db.select().from(tasks);
  }

  // Fetch a single task by ID
  static async getTaskById(taskId: number) {
    const task = await db.select().from(tasks).where(eq(tasks.id, taskId));
    return task[0] || null; // Return the first task or null if not found
  }

  // Create a new task
  static async createTask(userId: number, title: string, description: string) {
    const newTask = await db
      .insert(tasks)
      .values({
        title,
        description,
        userId,
      })
      .returning();
    return newTask[0]; // Return the created task
  }

  // Update a task
  static async updateTask(
    taskId: number,
    title: string,
    description: string,
    status: string
  ) {
    const updatedTask = await db
      .update(tasks)
      .set({
        title,
        description,
        status,
      })
      .where(eq(tasks.id, taskId))
      .returning();
    return updatedTask[0]; // Return the updated task
  }

  // Delete a task
  static async deleteTask(taskId: number) {
    await db.delete(tasks).where(eq(tasks.id, taskId));
    return { message: "Task deleted successfully" };
  }
}
