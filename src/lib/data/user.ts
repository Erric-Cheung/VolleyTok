import "server-only";
import { cache } from "react";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";

// Gets current user from session
export const getCurrentUser = cache(async () => {
  const session = await auth0.getSession();

  // No currently authenticated user
  if (!session) {
    return;
  }

  const currentUser =
    await sql`SELECT * FROM users WHERE user_id = ${session.user.sub}`;

  if (currentUser.rowCount !== 0) {
    const { user_id, email, username } = currentUser.rows[0];
    return { username, user_id };
  }
  return null;
});

// Get info from user with username
export const getUser = async (username: string) => {
  // No need for authentication unless private

  const { rows, rowCount } =
    await sql`SELECT * FROM users WHERE username = ${username}`;

  if (rowCount !== 0) {
    const { user_id, username } = rows[0];
    return { username, user_id };
  }

  return null;
};

// Check if current user is following followingId
export const checkIsFollowing = async (
  followerId: string,
  followingId: string
) => {
  const session = await auth0.getSession();
  if (!session) {
    return false;
  }

  const { rows, rowCount } =
    await sql`SELECT EXISTS (SELECT 1 FROM followers WHERE follower_id = ${followerId} AND following_id =${followingId})`;

  if (rowCount !== 0) {
    return rows[0].exists;
  }

  return false;
};

export const getFollowerList = async (username: string) => {
  const { rows, rowCount } = await sql`
    SELECT 
      users.user_id, 
      users.username
    FROM followers 
    JOIN users ON followers.follower_id = users.user_id
    WHERE followers.following_id = (
      SELECT user_id FROM users WHERE username = ${username}
    )
    `;

  return { followerList: rows, followerCount: rowCount };
};

export const getFollowingList = async (username: string) => {
  const { rows, rowCount } = await sql`
    SELECT 
      users.user_id, 
      users.username
    FROM followers 
    JOIN users ON followers.following_id = users.user_id
    WHERE followers.follower_id = (
      SELECT user_id FROM users WHERE username = ${username}
    )
    `;

  return { followingList: rows, followingCount: rowCount };
};
