"use server";

import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import
import { sql } from "@vercel/postgres";
import { auth0 } from "@/lib/auth0";
import { getCurrentUser } from "../data/user";
import { v4 as uuidv4 } from "uuid";

// Presigned URL for PUT method
export const createPresignedURL = async (formData: FormData) => {
  const session = await auth0.getSession();

  const fileType = formData.get("fileType") as string;
  const fileSize = formData.get("fileSize") as unknown as number;
  const fileId = formData.get("fileId") as string;
  const postTitle = formData.get("title") as string;
  const postDescription = formData.get("description") as string;

  // Check if fileId exists in S3 before creating post

  let errors: Errors = {};

  // Verify user and file
  if (!session) errors.authenticated = "Not authenticated";
  if (!fileId) errors.file = "Please add a file";
  if (!postTitle) errors.title = "Please add a title";
  if (!postDescription) errors.description = "Please include a description.";

  const ALLOWED_TYPES = ["video/mp4"];
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  // Check file size and type
  if (!ALLOWED_TYPES.includes(fileType))
    errors.file = "Invalid file type. Allowed file types: MP4.";
  if (fileSize > MAX_SIZE) errors.file = "File size exceeds limit.";

  if (Object.keys(errors).length) {
    return { errors };
  }

  // Initialize client with credentials
  const client = new S3Client({
    region: process.env.S3_REGION,
    credentials: fromEnv(),
  });

  // Specify bucket
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: fileId,
    ContentType: fileType,
  });

  const url = await getSignedUrl(client, command, { expiresIn: 600 });

  return { url: url, success: "Successfully created presigned URL" };
};

// Creates a post to the database
export const createPost = async (formData: FormData) => {
  const session = await auth0.getSession();

  const postTitle = formData.get("title") as string;
  const postDescription = formData.get("description") as string;
  const fileId = formData.get("fileId") as string;

  let errors: Errors = {};

  // Verify user and file
  if (!session) errors.authenticated = "Not authenticated";
  if (!fileId) errors.file = "Please add a file";
  if (!postTitle) errors.title = "Please add a title";
  if (!postDescription) errors.description = "Please include a description.";

  if (Object.keys(errors).length) {
    return { errors };
  }

  // Find user
  const user = await getCurrentUser();
  const userId = session?.user.sub;
  const username = user?.username;
  const postId = uuidv4();

  // Create post
  await sql`
  INSERT INTO posts (post_id, file_id, uploader_id, uploader, description, title)
  VALUES (${postId}, ${fileId}, ${userId}, ${username}, ${postDescription}, ${postTitle})
    `;

  // redirect

  return { success: "Successfully created post." };
};

export const createComment = async (comment: string, postId: string) => {
  try {
    const user = await getCurrentUser();

    // Redirect to login
    if (!user)
      return {
        // redirect to login
        message: "",
      };

    let errors: Errors = {};

    if (!comment.trim()) errors.comment = "Please add a comment";

    if (Object.keys(errors).length) {
      return { errors };
    }

    const commentId = uuidv4();

    await sql`
    INSERT INTO comments (comment_id, commenter_id, post_id, comment, created_at)
    VALUES (${commentId}, ${user.user_id}, ${postId}, ${comment}, NOW())
    `;

    // Add to activities table
    await sql`
    INSERT INTO activities (type, actor_id, target_id, post_id)
    SELECT 'comment', ${user.user_id}, posts.uploader_id, ${postId}
    FROM posts WHERE post_id = ${postId};
    `;

    return { success: "Successfully created comment." };
  } catch (error) {
    console.log("Failed to comment " + error);
    return {
      error,
    };
  }
};

export const deletePost = async (postId: string) => {
  console.log("--- DELETE POST ---");
  const user = await getCurrentUser();
  if (!user) {
    return { error: "Not authorized." };
  }

  try {
    const { rows, rowCount } =
      await sql`SELECT uploader_id FROM posts WHERE post_id = ${postId}`;

    const uploaderId = rows[0].uploader_id;

    if (rowCount === 0) {
      return { error: "Post does not exist." };
    }
    if (uploaderId !== user?.user_id) {
      return { error: "Not authorized." };
    }

    await sql`DELETE FROM posts WHERE post_id = ${postId}`;

    const client = new S3Client({
      region: process.env.S3_REGION,
      credentials: fromEnv(),
    });

    const input = { Bucket: process.env.S3_BUCKET, Key: postId };
    const command = new DeleteObjectCommand(input);
    const response = await client.send(command);

    console.log("Success. Object deleted.", response);
    return { success: "Post successfully deleted." };
  } catch (error) {
    console.log("Something went wrong: " + error);
    return {
      error,
    };
  }
};

export const likePost = async (postId: string) => {
  const user = await getCurrentUser();
  console.log("LIKING POST");

  let errors: Errors = {};
  if (!user) {
    // redirect to login
    return;
  }

  try {
    await sql`
    INSERT INTO likes (post_id, user_id)
    VALUES (${postId}, ${user.user_id})
    ON CONFLICT (post_id, user_id) DO NOTHING;
    `;

    // Add to activities table
    await sql`
    INSERT INTO activities (type, actor_id, target_id, post_id)
    SELECT 'like', ${user.user_id}, posts.uploader_id, ${postId}
    FROM posts WHERE post_id = ${postId};
    `;

    // Get like count
    const { rows } = await sql`
    SELECT COUNT(*) AS count FROM likes WHERE post_id = ${postId};
    `;

    const likeCount = Number(rows[0]?.count ?? 0);

    return { success: true, likeCount: likeCount };
  } catch (error) {
    console.log("Failed to like post: " + error);
    return {
      error,
    };
  }
};

export const unlikePost = async (postId: string) => {
  const user = await getCurrentUser();
  console.log("LIKING POST");

  let errors: Errors = {};
  if (!user) {
    // redirect to login
    return;
  }

  try {
    await sql`
    DELETE FROM likes
    WHERE post_id = ${postId} AND user_id = ${user.user_id};
  `;

    // Get like count
    const { rows } = await sql`
    SELECT COUNT(*) AS count FROM likes WHERE post_id = ${postId};
  `;

    const likeCount = Number(rows[0]?.count ?? 0);

    return { success: true, likeCount: likeCount };
  } catch (error) {
    console.log("Failed to like post: " + error);
    return {
      error,
    };
  }
};

interface Errors {
  file?: string;
  title?: string;
  description?: string;
  fileSize?: string;
  fileType?: string;
  authorized?: string;
  authenticated?: string;
  comment?: string;
}
