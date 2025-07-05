"use server";

import PostInfo from "@/components/Post/Content/PostInfo";
import PostVideo from "@/components/Post/Content/PostVideo";
import PageModal from "@/components/Modals/RouteModals/PageModal";
import {
  getIdPost,
  getPostComments,
  getPostLikeInfo,
} from "@/lib/data/post";

export default async function PostModal({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const postId = (await params).postId;
  const post = await getIdPost(postId);
  const comments = await getPostComments(postId);
  const likeInfo = await getPostLikeInfo(postId);

  console.log("GLOBAL MODAL");

  if (!post) {
    // redirect or display 404
    return;
  }

  return (
    <PageModal>
      <div className="flex w-max-full w-full h-full">
        <div className="flex flex-col w-full h-full flex-[1_0_400px]">
          <PostVideo videoUrl={post.videoUrl}></PostVideo>
        </div>
        <div className="min-w-[400px] h-full flex-[0_0_400px]">
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
    </PageModal>
  );
}
