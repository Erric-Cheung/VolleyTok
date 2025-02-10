"use server";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { fromEnv } from "@aws-sdk/credential-providers"; // ES6 import
import { sql } from "@vercel/postgres";
import { auth0 } from "@/lib/auth0";
import { getCurrentUser } from "../data/user";

// Presigned URL for PUT method
export const getPresignedURL = async (formData: FormData) => {
  const session = await auth0.getSession();

  // No currently authenticated user
  if (!session) {
    throw new Error("Not authenticated");
  }

  const fileType = formData.get("fileType") as string;
  const fileName = formData.get("fileName") as string;
  const fileSize = formData.get("fileSize") as unknown as number;
  const fileId = formData.get("fileId") as string;

  const ALLOWED_TYPES = ["video/mp4"];
  const MAX_SIZE = 50 * 1024 * 1024; // 50MB

  // Check file size and type

  if (fileSize > MAX_SIZE) {
    throw new Error("File size exceeds limit.");
  }

  if (!ALLOWED_TYPES.includes(fileType)) {
    throw new Error("Invalid file type. Allowed: MP4.");
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

  return url;
};

// Creates a post to the database
export const createPost = async (prevState: any, formData: FormData) => {
  const session = await auth0.getSession();

  // No currently authenticated user
  if (!session) {
    return;
  }

  const postTitle = formData.get("title") as string;
  const postDescription = formData.get("description") as string;
  const fileId = formData.get("fileId") as string;

  let errors: Errors = {};

  if (!fileId) {
    errors.file = "Please add a file";
  }

  if (!postTitle) {
    errors.title = "Please add a title";
  }

  if (!postDescription) {
    errors.description = "Please include a description.";
  }

  // Find user
  const user = await getCurrentUser();

  if (!user) {
    return;
  }
  const userId = session.user.sub;
  const username = user.username;

  if (errors.description || errors.title || errors.file) {
    return errors;
  }

  // Create post
  await sql`
  INSERT INTO posts (file_id, uploader_id, uploader, description, title)
  VALUES (${fileId}, ${userId}, ${username}, ${postDescription}, ${postTitle})
    `;

  // redirect

  return;
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
