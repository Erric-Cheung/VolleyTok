import { cache } from "react";
import { auth0 } from "@/lib/auth0";
import { sql } from "@vercel/postgres";

export const getCurrentUser = cache(async () => {
  const session = await auth0.getSession();

  // No currently authenticated user
  if (!session) {
    return;
  }

  const currentUser =
    await sql`SELECT * FROM users WHERE user_id = ${session.user.sub}`;

  if (currentUser.rowCount !== 0) {
    const { user_id, email, username } = currentUser.rows[0];
    return { username };
  }
  return null;
});
