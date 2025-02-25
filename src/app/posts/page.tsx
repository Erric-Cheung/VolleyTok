"use server";

import PostList from "@/components/Post/PostList";
import { getLatestPosts, getUsernamePosts } from "@/lib/data/post";

export default async function Posts() {
  // Fetch posts here
  const posts = await getLatestPosts();
  console.log(posts);

  // const posts = [
  //   {
  //     description: "Test Description",
  //     title: "Test Title",
  //     uploader: "buzzy",
  //     file_id: "/clip1.mp4",
  //     videoUrl: "/clip1.mp4",
  //     timeAgo: "35 minutes ago",
  //     timestamp: new Date(),
  //     likes: 0,
  //   },
  //   {
  //     title: "Test Title",
  //     description: "Test Description",
  //     uploader: "buzzy",
  //     file_id: "/clip1.mp4",
  //     videoUrl: "/clip1.mp4",
  //     timeAgo: "6 hours ago",
  //     timestamp: new Date(),
  //     likes: 11,
  //   },
  //   {
  //     title: "Test Title",
  //     description: "Test Description",
  //     uploader: "buzzy",
  //     file_id: "/clip1.mp4",
  //     videoUrl: "/clip1.mp4",
  //     timeAgo: "6 hours ago",
  //     timestamp: new Date(),
  //     likes: 11,
  //   },
  //   {
  //     title: "Test Title",
  //     description: "Test Description",
  //     uploader: "buzzy",
  //     file_id: "/clip1.mp4",
  //     videoUrl: "/clip1.mp4",
  //     timeAgo: "6 hours ago",
  //     timestamp: new Date(),
  //     likes: 11,
  //   },
  // ];

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)] ">
      <main className="flex flex-col gap-8 row-start-2 items-center w-full">
        <div className="max-w-[1920px] w-full p-4">
          <div className="mb-2">Latest Clips</div>
          <PostList posts={posts}></PostList>
        </div>
      </main>
    </div>
  );
}
