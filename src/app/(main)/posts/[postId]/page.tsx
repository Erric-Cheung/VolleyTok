"use server";

import PostInfo from "@/components/Post/Content/PostInfo";
import PostVideo from "@/components/Post/Content/PostVideo";
import { getIdPost, getPostComments, getPostLikeInfo } from "@/lib/data/post";

export default async function Post({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  const post = await getIdPost(postId);
  const comments = await getPostComments(postId);
  const likeInfo = await getPostLikeInfo(postId);

  if (!post) {
    // redirect or display 404
    return;
  }

  return (
    <div className="items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
      <div className="flex flex-col gap-8 row-start-2 items-center w-full overflow-auto ">
        <div className="flex flex-col w-max-full w-full pl-8 pr-8 max-w-[1920px]">
          <div className="flex max-h-[calc(100vh-120px)] aspect-[0.7/1] flex-col w-full h-full">
            <PostVideo videoUrl={post.videoUrl}></PostVideo>
          </div>
          <PostInfo
            postId={postId}
            uploader={post.uploader}
            uploader_id={post.uploader_id}
            description={post.description}
            timestamp={post.timestamp}
            comments={comments}
            likeCount={likeInfo.likeCount ?? 0}
            userLiked={likeInfo.userLiked}
          ></PostInfo>
        </div>
      </div>
    </div>
  );
}
