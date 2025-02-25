import "server-only";
import { cache } from "react";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";
import { Post } from "../types/types";

// Get posts from user with username slug
export const getUsernamePosts = async (slug: string) => {
  // No need for authentication unless private

  const { rows } = await sql<{
    file_id: string;
    uploader: string;
    title: string;
    description: string;
    likes: number;
    timestamp: string;
  }>`SELECT file_id, uploader, description, title, likes, timestamp FROM posts WHERE uploader = ${slug}`;

  const posts: Post[] = rows.map((row) => ({
    ...row,
    timestamp: new Date(row.timestamp),
    timeAgo: timeAgo(row.timestamp),
    videoUrl: process.env.CLOUDFRONT_URL + "/" + row.file_id,
  }));

  return posts;
};

// Get latest 10 posts after offset
export const getLatestPosts = async (page = 1): Promise<Post[]> => {
  const pageSize = 10; // Number of posts per page
  const offset = (page - 1) * pageSize; // Calculate offset

  const { rows } = await sql<{
    file_id: string;
    uploader: string;
    title: string;
    description: string;
    likes: number;
    timestamp: string;
  }>`
    SELECT file_id, uploader, description, title, likes, timestamp 
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
};

export const getIdPost = async (id: string): Promise<Post | null> => {
  const { rows, rowCount } = await sql<{
    file_id: string;
    uploader: string;
    title: string;
    description: string;
    likes: number;
    timestamp: string;
  }>`SELECT file_id, uploader, description, title, likes, timestamp FROM posts WHERE file_id = ${id}`;

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

// Get comments from post with id
export const getPostComments = async (id: string) => {
  return;
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
