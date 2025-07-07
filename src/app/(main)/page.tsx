"use server";

import PostScrollList from "@/components/Post/PostScrollList";
import { getLatestPosts } from "@/lib/data/post";

export default async function Home() {
  const posts = await getLatestPosts();
  console.log(posts);
  if (!posts) {
    return;
  }

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] ">
      <div className="flex flex-col gap-8 row-start-2 items-center w-full">
        <div className=" w-full ">
          <PostScrollList initialPosts={posts} />
        </div>
      </div>
    </div>
  );
}
