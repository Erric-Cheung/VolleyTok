// JUST NEEDS TO BE HOME BACKGROUND ?
"use server";

import PostList from "@/components/Post/PostList";
import { getLatestPosts } from "@/lib/data/post";

// Settings with home fallback page
export default async function SettingsHome() {
  const posts = await getLatestPosts();

  console.log("FALLBACK SETTINGS")

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] ">
      <div className="flex flex-col gap-8 row-start-2 items-center w-full">
        <div className="max-w-[1920px] w-full p-4">
          <div className="mb-2">Latest Clips</div>
          <PostList posts={posts}></PostList>
        </div>
      </div>
    </div>
  );
}
