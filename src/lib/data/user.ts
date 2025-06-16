import "server-only";
import { cache } from "react";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";

// Gets current user from session
export const getCurrentUser = cache(async () => {
  console.log("----- GET CURRENT USER -----");
  const session = await auth0.getSession();
  if (!session) return null;
  const user = await getUserById(session.user.sub);
  return user;
});

// Get user by user_id
export const getUserById = cache(async (id: string) => {
  console.log("----- GET USER BY ID -----");
  try {
    const currentUser = await sql`SELECT * FROM users WHERE user_id = ${id}`;

    if (currentUser.rowCount !== 0) {
      const { user_id, email, username, bio } = currentUser.rows[0];
      return { username, email, user_id, bio };
    }
    return null;
  } catch (error) {
    console.log(error);
  }
});

// Get info from user with username
export const getUser = async (username: string) => {
  console.log("----- GET USER -----");

  const { rows, rowCount } =
    await sql`SELECT * FROM users WHERE username = ${username}`;

  if (rowCount !== 0) {
    const { user_id, username, bio } = rows[0];
    return { username, bio, user_id };
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

export const getActivityNotifications = async (userId: string) => {
  const { rows } = await sql`
    SELECT 
      a.*, 
      u.username AS actor_username
    FROM activities a
    JOIN users u ON a.actor_id = u.user_id
    WHERE a.target_id = ${userId}
    ORDER BY a.created_at DESC
    LIMIT 20
    `;

  return rows;
};
