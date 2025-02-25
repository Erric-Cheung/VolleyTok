"use server";

import PostInfo from "@/components/Post/Content/PostInfo";
import PostVideo from "@/components/Post/Content/PostVideo";
import PostContent from "@/components/Post/PostContent";
import { getIdPost } from "@/lib/data/post";

export default async function PostModal({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  // const post = await getIdPost(postId);

  const post = {
    description: "Test Description",
    title: "Test Title",
    uploader: "buzzy",
    file_id: "/clip1.mp4",
    videoUrl: "/clip1.mp4",
    timeAgo: "35 minutes ago",
    timestamp: new Date(),
    likes: 0,
  };

  if (!post) {
    // redirect or display 404
    return;
  }

  console.log(post);

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {/* <Post post={post}></VideoPost> */}
        <div className="flex max-h-[calc(100vh-60px)] p-4 flex-col lg:flex-row">
          <PostVideo videoUrl={post.videoUrl}></PostVideo>
          <PostInfo
            uploader={post.uploader}
            description={post.description}
          ></PostInfo>
        </div>
      </main>
    </div>
  );
}
