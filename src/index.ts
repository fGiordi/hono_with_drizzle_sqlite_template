import "dotenv/config";
import { Hono } from "hono";
import userRouter from "./routes/user";
import taskRouter from "./routes/task";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.route("/users", userRouter);
app.route("/tasks", taskRouter);

export default app;
