"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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

  const url = await getSignedUrl(client, command, { expiresIn: 120 });

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
  VALUES (${postId} ${fileId}, ${userId}, ${username}, ${postDescription}, ${postTitle})
    `;

  // redirect

  return { success: "Successfully created post." };
};

export const createComment = async (comment: string, postId: string) => {
  const session = await auth0.getSession();

  // Redirect to login
  if (!session)
    return {
      // redirect to login
      message: "",
    };

  let errors: Errors = {};

  if (!comment.trim()) errors.comment = "Please add a comment";

  if (Object.keys(errors).length) {
    return { errors };
  }

  const userId = session?.user.sub;
  const commentId = uuidv4();

  await sql`
  INSERT INTO comments (comment_id, commenter_id, post_id, comment, created_at)
  VALUES (${commentId}, ${userId}, ${postId}, ${comment}, NOW())
    `;

  return { success: "Successfully created comment." };
};

export const likePost = async () => {
  const session = await auth0.getSession();

  if (!session) {
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
