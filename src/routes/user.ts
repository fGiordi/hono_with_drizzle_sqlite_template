// routes/users.ts
import { Hono } from "hono";
import { UserService } from "../services/users";
import argon2 from "argon2";
import { sign } from "hono/jwt";

const userRouter = new Hono();

userRouter.post("/", async (c) => {
  const { username, email, password } = await c.req.json();

  if (!username || !email || !password) {
    return c.json({ message: "All fields are required" }, 400);
  }

  const hashedPassword = await argon2.hash(password);
  const newUser = await UserService.createUser(username, email, hashedPassword);

  return c.json({ message: "User created successfully", user: newUser });
});

userRouter.post("/login", async (c) => {
  const { email, password } = await c.req.json();

  if (!email || !password) {
    return c.json({ message: "Email and password are required" }, 400);
  }

  const user = await UserService.getUserByEmail(email);
  if (!user) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const isMatch = await argon2.verify(user.password, password);

  if (!isMatch) {
    return c.json({ message: "Invalid credentials" }, 401);
  }

  const token = await sign(
    {
      id: user.id,
      email: user.email,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    },
    "secret"
  );

  return c.json({ message: "Login successful", token });
});

userRouter.get("/", async (c) => {
  const allUsers = await UserService.getAllUsers();
  return c.json(allUsers);
});

userRouter.get("/:id", async (c) => {
  const userId = c.req.param("id");
  const user = await UserService.getUserById(Number(userId));
  return c.json(user);
});

userRouter.put("/:id", async (c) => {
  const userId = c.req.param("id");
  const { username, email, password } = await c.req.json();
  const updatedUser = await UserService.updateUser(
    Number(userId),
    username,
    email,
    password
  );
  return c.json(updatedUser);
});

userRouter.delete("/:id", async (c) => {
  const userId = c.req.param("id");
  const response = await UserService.deleteUser(Number(userId));
  return c.json(response);
});

export default userRouter;
