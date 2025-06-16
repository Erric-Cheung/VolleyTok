import "server-only";
import { sql } from "@vercel/postgres";

export const createActivitiesTable = async () => {
  await sql`CREATE TABLE IF NOT EXISTS activities (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow')),
        actor_id VARCHAR NOT NULL REFERENCES users(user_id),
        target_id VARCHAR NOT NULL REFERENCES users(user_id),
        post_id UUID REFERENCES posts(post_id),
        created_at TIMESTAMP DEFAULT NOW()
        );`;

  console.log("Created activiies table");
};
