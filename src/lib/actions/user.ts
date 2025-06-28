"use server";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";

import { cache } from "react";
import { redirect } from "next/navigation";
import { userSchema } from "../types/validation";
import { UserError } from "../types/types";
import { getCurrentUser, getUserById } from "../data/user";

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

  // Validate username
  const validationResult = userSchema.safeParse({ username });
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

export const updateUser = async (formData: FormData) => {
  const errors: UserError = {};
  try {
    const session = await auth0.getSession();
    const currentUser = await getCurrentUser();

    // No currently authenticated user
    if (!session || !currentUser) {
      errors.authentication = "Not authenticated.";
      return { errors: errors };
    }

    // Get input data
    const username = formData.get("username") as string;
    const bio = formData.get("bio") as string;

    // Validate only inputted values
    const validationInput: { username?: string; bio?: string } = {};
    if (username) validationInput.username = username;
    if (bio) validationInput.bio = bio;

    // Validate username and bio
    const validationResult = userSchema.partial().safeParse(validationInput);
    const errorResults = validationResult.error?.format();
    if (errorResults?.username) {
      errors.username = errorResults.username?._errors[0];
    }

    if (errorResults?.bio) {
      errors.bio = errorResults.bio?._errors[0];
    }

    const client = await sql.connect();
    // Check if inputted username already exists
    const existingUser =
      await client.sql`SELECT * FROM users WHERE username = ${username}`;

    if (existingUser.rowCount !== 0) {
      errors.username = "Username is taken.";
    }

    // Return any found errors
    if (Object.keys(errors).length > 0) {
      return { errors: errors };
    }

    // Update user with changes if they exist
    const fields = [];
    const values = [];

    if (username) {
      fields.push(`username = $${fields.length + 1}`);
      values.push(username);
    }
    if (bio) {
      fields.push(`bio = $${fields.length + 1}`);
      values.push(bio);
    }

    if (fields.length > 0) {
      const query = `
        UPDATE users
        SET ${fields.join(", ")}
        WHERE user_id = $${fields.length + 1}
      `;
      values.push(currentUser.user_id); // final placeholder

      await client.query(query, values);
    }

    return { success: "Successfully updated user." };
  } catch (err) {
    console.log("Failed to update user: " + err);
    return {
      err,
    };
  }
};

export const followUser = async (followId: string) => {
  console.log("FOLLOW USER");
  const session = await auth0.getSession();
  const currentUser = await getCurrentUser();

  if (!session || !currentUser) {
    // redirect login
    return { error: "Not authneticated" };
  }

  const followUser = await getUserById(followId);

  if (!followUser) {
    return { error: "User does not exist." };
  }

  if (currentUser?.user_id === followId) {
    return { error: "Cannot follow yourself." };
  }

  try {
    await sql`
    INSERT INTO followers (follower_id, following_id)
    VALUES (${currentUser?.user_id}, ${followId})
    ON CONFLICT (follower_id, following_id) DO NOTHING;
    `;

    await sql`
    INSERT INTO activities (type, actor_id, target_id, post_id)
    VALUES ('follow', ${currentUser.user_id}, ${followId}, NULL);
    `;
  } catch (error) {
    console.log("Error following user: " + error);
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
    return { error: "Not authneticated" };
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
    console.log("Error unfollowing user" + error);
    return { error: "Failed to unfollow user." };
  }

  return { success: true };
};

