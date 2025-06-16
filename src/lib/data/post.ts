import "server-only";
import { cache } from "react";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";
import { Post, Comment } from "../types/types";
import { getCurrentUser } from "./user";

// Get posts from user with username slug
export const getUsernamePosts = async (username: string) => {
  // No need for authentication unless private

  console.log("------ USER POSTS------");

  const { rows } = await sql<{
    file_id: string;
    post_id: string;
    uploader: string;
    uploader_id: string;
    title: string;
    description: string;
    likes: number;
    timestamp: string;
  }>`SELECT file_id, post_id, uploader, uploader_id, description, title, likes, timestamp FROM posts WHERE uploader = ${username}`;

  const posts: Post[] = rows.map((row) => ({
    ...row,
    timestamp: new Date(row.timestamp),
    timeAgo: timeAgo(row.timestamp),
    videoUrl: process.env.CLOUDFRONT_URL + "/" + row.file_id,
  }));

  return posts;
};

// Get latest 10 posts after offset
export const getLatestPosts = cache(async (page = 1): Promise<Post[]> => {
  console.log("----- LATEST POSTS -----");
  const pageSize = 10; // Number of posts per page
  const offset = (page - 1) * pageSize; // Calculate offset

  const { rows } = await sql<{
    file_id: string;
    post_id: string;
    uploader: string;
    uploader_id: string;
    title: string;
    description: string;
    likes: number;
    timestamp: string;
  }>`
    SELECT file_id, post_id, uploader, uploader_id description, title, likes, timestamp 
    FROM posts
    ORDER BY timestamp DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  const posts: Post[] = rows.map((row) => ({
    ...row,
    timestamp: new Date(row.timestamp),
    timeAgo: timeAgo(row.timestamp),
    videoUrl: process.env.CLOUDFRONT_URL + "/" + row.file_id,
  }));

  return posts;
});

// Get post with the id
export const getIdPost = async (id: string): Promise<Post | null> => {
  console.log("----- FETCHING POST -----");
  const { rows, rowCount } = await sql<{
    file_id: string;
    post_id: string;
    uploader: string;
    uploader_id: string;
    title: string;
    description: string;
    likes: number;
    timestamp: string;
  }>`SELECT file_id, post_id, uploader, uploader_id, description, title, likes, timestamp FROM posts WHERE post_id = ${id}`;

  console.log(id);

  if (rowCount == 0) {
    return null;
  }

  const post: Post = {
    ...rows[0],
    timestamp: new Date(rows[0].timestamp),
    timeAgo: timeAgo(rows[0].timestamp),
    videoUrl: process.env.CLOUDFRONT_URL + "/" + rows[0].file_id,
  };

  return post;
};

// Get comments from postId
export const getPostComments = async (
  postId: string,
  page = 1
): Promise<Comment[]> => {
  console.log("----- FETCHING COMMENTS -----");

  const pageSize = 10; // Number of posts per page
  const offset = (page - 1) * pageSize; // Calculate offset

  const { rows } = await sql<{
    comment: string;
    created_at: string;
    username: string;
  }>`
    SELECT comments.comment, comments.created_at, users.username 
    FROM comments
    JOIN users ON comments.commenter_id = users.user_id
    WHERE post_id = ${postId}
    ORDER BY created_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  const comments: Comment[] = rows.map((row) => ({
    commenter: row.username,
    comment: row.comment,
    timestamp: new Date(row.created_at),
    timeAgo: timeAgo(row.created_at),
  }));

  return comments;
};

// Get users who liked from postId
export const getPostLikedUsers = async (postId: string) => {
  console.log("----- FETCHING LIKES -----");

  try {
    const { rows, rowCount } = await sql`
    SELECT likes.liked_at, users.username 
    FROM likes
    JOIN users ON likes.user_id = users.user_id
    WHERE post_id = ${postId}
  `;

    const likedUsers = rows.map((row) => ({
      username: row.username,
      liked_at: new Date(row.created_at),
      timeAgo: timeAgo(row.liked_at),
    }));

    return { likedUsers: likedUsers, likeCount: rowCount };
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};

// Get post like info for current user
export const getPostLikeInfo = async (postId: string) => {
  console.log("----- FETCHING LIKES -----");
  const user = await getCurrentUser();
  try {
    if (!user) {
      // Query for total likes
      const { rows } = await sql`
        SELECT COUNT(*) AS like_count
        FROM likes
        WHERE post_id = ${postId};
      `;
      return {
        likeCount: Number(rows[0].like_count),
        userLiked: false,
      };
    }

    // Query like total likes and user liked status
    const { rows } = await sql`
      SELECT 
        COUNT(*) FILTER (WHERE user_id = ${user.user_id}) > 0 AS user_liked,
        COUNT(*) AS like_count
      FROM likes
      WHERE post_id = ${postId};
    `;

    const { user_liked, like_count } = rows[0];

    return {
      likeCount: Number(like_count),
      userLiked: user_liked,
    };
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};

// Helper function to get time posted ago
const timeAgo = (timestamp: string): string => {
  const past = new Date(timestamp);
  const now = new Date();

  const diffMs = now.getTime() - past.getTime(); // Difference in milliseconds
  const diffMinutes = Math.floor(diffMs / (1000 * 60)); // Convert to minutes
  const diffHours = Math.floor(diffMinutes / 60); // Convert to hours
  const diffDays = Math.floor(diffHours / 24); // Convert to days

  if (diffMinutes < 1) {
    return "Just now";
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? "s" : ""} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
  } else {
    return `${diffDays} day${diffDays !== 1 ? "s" : ""} ago`;
  }
};
