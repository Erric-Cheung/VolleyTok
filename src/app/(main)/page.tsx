"use server";

import PostList from "@/components/Post/PostList";
import { getLatestPosts } from "@/lib/data/post";

export default async function Home() {
  const posts = await getLatestPosts();
  
  // const postRes = await fetch(
  //   `http://localhost:3000/api/posts?username=${"buzzy"}`,
  //   {
  //     cache: "force-cache",
  //     next: { revalidate: 60 },
  //   }
  // );
  // const data = await postRes.json();

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
