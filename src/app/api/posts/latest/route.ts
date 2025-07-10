import { getLatestPostsWithOffset } from "@/lib/data/post";
import { NextRequest, NextResponse } from "next/server";

// GET Route Handler for latest posts
export async function GET(req: NextRequest) {
  try {
    console.log("---- FETCHING POSTS API ----");
    const searchParams = req.nextUrl.searchParams;
    const paramOffset = parseInt(searchParams.get("offset") || "0");
    const paramLimit = parseInt(searchParams.get("limit") || "10");

    const limit = Math.max(1, Math.min(paramLimit, 20));

    const posts = await getLatestPostsWithOffset(paramOffset, limit); // implement in DB lib
    console.log(posts);
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error: " + error },
      { status: 500 }
    );
  }
}
