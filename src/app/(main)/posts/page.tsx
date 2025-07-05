"use server";

import PostPreviewList from "@/components/Post/PostPreviewList";
import { getLatestPosts } from "@/lib/data/post";

export default async function Posts() {
  const posts = await getLatestPosts();

  if (!posts) {
    return;
  }

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] ">
      <div className="flex flex-col gap-8 row-start-2 items-center w-full">
        <div className="max-w-[1920px] w-full p-4">
          <div className="flex mb-4 gap-2">
            <span className="font-bold">Latest</span>
            {/* <span className=" p-2 bg-black text-white font-bold rounded-lg">Latest</span> */}
            {/* <span className=" p-2s bg-gray-300 font-bold rounded-lg">Popular</span> */}
          </div>
          <PostPreviewList posts={posts} />
        </div>
      </div>
    </div>
  );
}
