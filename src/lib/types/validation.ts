import { z } from "zod";

export const usernameSchema = z.object({
    username: z
      .string()
      .min(3, "Username must be at least 3 characters long.")
      .max(12, "Username must be 12 characters or less.")
      .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores are allowed.")
  });