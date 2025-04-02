import { sql } from "@vercel/postgres";
import { auth0 } from "@/lib/auth0";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/data/user";

/**
 * POST method to handle follow and unfollow of a user
 * @param type The action type ("follow" or "unfollow").
 * @param user The user id to follow or unfollow  
 */

export async function POST(req: Request) {
  try {
    const { type, userId } = await req.json();
    const session = await auth0.getSession();
    const currentUser = await getCurrentUser();

    console.log(type)
    console.log(userId)

    if (!session || !currentUser) {
      // redirect login
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId){
      console.log("ERROR HERE")
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (type === "follow") {
      await sql`
      INSERT INTO followers (follower_id, following_id)
      VALUES (${currentUser?.user_id}, ${userId})
      ON CONFLICT (follower_id, following_id) DO NOTHING;
      `;
      return NextResponse.json({
        success: true,
        message: "Followed successfully",
      });
    }

    if (type === "unfollow") {
      const { rowCount } = await sql`
      DELETE FROM followers
      WHERE follower_id = ${currentUser.user_id} 
      AND following_id = ${userId};`;

      if (rowCount === 0) {
        return NextResponse.json(
          { error: "Not following usertype." },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        message: "Unfollowed successfully",
      });
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  } catch (error) { 
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
