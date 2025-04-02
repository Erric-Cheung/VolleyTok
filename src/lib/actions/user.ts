"use server";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";
import { cache } from "react";
import { redirect } from "next/navigation";
import { usernameSchema } from "../types/validation";
import { UserError } from "../types/types";
import { getCurrentUser } from "../data/user";

// Creaters user in /welcome
export const createUser = cache(async (formData: FormData) => {
  const session = await auth0.getSession();
  const errors: UserError = {};

  // No currently authenticated user
  if (!session) {
    errors.authentication = "Not authenticated.";
    return { errors: errors };
  }

  const username = formData.get("username") as string;
  console.log(username);

  // Validate username
  const validationResult = usernameSchema.safeParse({ username });
  const errorResults = validationResult.error?.format();
  if (errorResults?.username) {
    errors.username = errorResults.username?._errors[0];
  }

  // Check if username exists
  const existingUser =
    await sql`SELECT * FROM users WHERE username = ${username}`;

  if (existingUser.rowCount !== 0) {
    errors.username = "Username is taken.";
  }

  if (Object.keys(errors).length > 0) {
    return { errors: errors };
  }

  // Insert user
  await sql`
    INSERT  INTO users (user_id, email, username)
    VALUES (${session.user.sub}, ${session.user.email}, ${username})
    ON CONFLICT (user_id) DO NOTHING;
  `;

  redirect("/");
});

export const followUser = async (followId: string) => {
  console.log("FOLLOW USER")
  const session = await auth0.getSession();
  const currentUser = await getCurrentUser();

  if (!session || !currentUser) {
    // redirect login
    return {error: "Not authneticated"};
  }

  console.log(currentUser.user_id);
  console.log(followId);

  if (currentUser?.user_id === followId) {
    return { error: "Cannot follow yourself." };
  }

  try {
    await sql`
    INSERT INTO followers (follower_id, following_id)
    VALUES (${currentUser?.user_id}, ${followId})
    ON CONFLICT (follower_id, following_id) DO NOTHING;
    `;
  } catch (error) {
    console.log("Error following user");
    return { error: "Failed to follow user." };
  }

  return { success: true };
};

export const unfollowUser = async (unfollowId: string) => {
  console.log(`UNFOLLOW USER`);
  const session = await auth0.getSession();
  const currentUser = await getCurrentUser();

  if (!session || !currentUser) {
    // redirect login
    return {error: "Not authneticated"};
  }

  try {
    const { rowCount } = await sql`
    DELETE FROM followers
    WHERE follower_id = ${currentUser.user_id} 
    AND following_id = ${unfollowId};`;

    if (rowCount === 0) {
      return { error: "Not following user." };
    }
  } catch (error) {
    console.log("Error following user");
    return { error: "Failed to unfollow user." };
  }

  return { success: true };
};
