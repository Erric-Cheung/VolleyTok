import { sql } from "@vercel/postgres";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";
import { getAccessToken } from "@auth0/nextjs-auth0";

// create user and add to db

// only authenticated users can access, insert with their own ID from session

// Return user
export async function GET(req: Request) {
  const session = await auth0.getSession();
}
