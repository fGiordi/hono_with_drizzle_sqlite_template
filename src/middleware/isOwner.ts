import { Context, Next } from "hono";

// Middleware to check if the user is accessing their own resource
export const isOwner = async (c: Context, next: Next) => {
  const authUser = c.get("user");
  const userId = c.req.query("userId");

  if (!userId) {
    return c.json({ message: "User ID is required" }, 400);
  }

  if (Number(userId) !== authUser.id) {
    return c.json(
      { message: "Forbidden: You can only access your own data" },
      403
    );
  }

  await next();
};
