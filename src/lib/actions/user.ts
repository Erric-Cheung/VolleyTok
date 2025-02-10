"use server";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";
import { cache } from "react";
import { redirect } from "next/navigation";

// Creaters user in /welcome
export const createUser = cache(async (prevState: any, formData: FormData) => {
  const session = await auth0.getSession();

  // No currently authenticated user
  if (!session) {
    return;
  }

  const username = formData.get("username") as string;

  // Validate username
  if (!username) {
    return { message: "Please enter a valid username" };
  }

  // Check if username exists
  const existingUser =
    await sql`SELECT * FROM users WHERE username = ${username}`;

  if (existingUser.rowCount !== 0) {
    return { message: "Username is taken." };
  }

  // Insert user
  await sql`
  INSERT INTO users (user_id, email, username)
  VALUES (${session.user.sub}, ${session.user.email}, ${username})
  ON CONFLICT (user_id) DO NOTHING;
`;

  redirect("/");
});
