// routes/tasks.ts
import { Hono } from "hono";
import { TaskService } from "../services/tasks";
import { isAuthenticated } from "../middleware/auth";
import { isOwner } from "../middleware/isOwner";

const taskRouter = new Hono();

taskRouter.use("*", isAuthenticated, isOwner);

taskRouter.get("/", async (c) => {
  const userId = c.req.query("userId");

  let tasksList;
  if (userId) {
    tasksList = await TaskService.getTasksByUserId(Number(userId));
    if (tasksList.length === 0) {
      return c.json(
        { message: `No tasks found for user with ID ${userId}` },
        404
      );
    }
  } else {
    tasksList = await TaskService.getAllTasks();
  }

  return c.json(tasksList);
});

taskRouter.get("/:id", async (c) => {
  const taskId = c.req.param("id");
  const task = await TaskService.getTaskById(Number(taskId));

  if (!task) {
    return c.json({ message: `Task with ID ${taskId} not found` }, 404);
  }

  return c.json(task);
});

taskRouter.post("/", async (c) => {
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ message: "User ID is required" }, 400);
  }

  const { title, description } = await c.req.json();
  const newTask = await TaskService.createTask(
    Number(userId),
    title,
    description
  );

  return c.json(newTask);
});

taskRouter.delete("/:id", async (c) => {
  const taskId = c.req.param("id");
  const result = await TaskService.deleteTask(Number(taskId));
  return c.json(result);
});

taskRouter.put("/:id", async (c) => {
  const taskId = c.req.param("id");
  const { title, description, status } = await c.req.json();
  const updatedTask = await TaskService.updateTask(
    Number(taskId),
    title,
    description,
    status
  );

  if (!updatedTask) {
    return c.json({ message: `Task with ID ${taskId} not found` }, 404);
  }

  return c.json(updatedTask);
});

export default taskRouter;
