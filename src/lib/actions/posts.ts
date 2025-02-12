"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import
import { sql } from "@vercel/postgres";
import { auth0 } from "@/lib/auth0";
import { getCurrentUser } from "../data/user";

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
  if (!ALLOWED_TYPES.includes(fileType)) errors.file = "Invalid file type. Allowed file types: MP4.";
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

  // Check if fileId exists in S3 before creating post

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

  // Create post
  await sql`
  INSERT INTO posts (file_id, uploader_id, uploader, description, title)
  VALUES (${fileId}, ${userId}, ${username}, ${postDescription}, ${postTitle})
    `;

  // redirect

  return { success: "Successfully created post." };
};

interface Errors {
  file?: string;
  title?: string;
  description?: string;
  fileSize?: string;
  fileType?: string;
  authorized?: string;
  authenticated?: string;
}
