import { sql } from "@vercel/postgres";
import { auth0 } from "@/lib/auth0";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("---- FETCHING POSTS API ----")
    const searchParams = req.nextUrl.searchParams;
    const username = searchParams.get("username");
    console.log(username);

    if (!username) {
    }

    const { rows } =
      await sql`SELECT file_id, uploader, description, title, likes, timestamp FROM posts WHERE uploader = ${username}`;

    const posts = rows.map((row) => ({
      ...row,
      timestamp: new Date(row.timestamp),
      timeAgo: timeAgo(row.timestamp),
      videoUrl: process.env.CLOUDFRONT_URL + "/" + row.file_id,
    }));

    return NextResponse.json({
      posts: posts,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

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
