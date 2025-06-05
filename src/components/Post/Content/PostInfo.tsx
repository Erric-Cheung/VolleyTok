"use server";

import CommentBox from "@/components/Input/TextInput/CommentBox";
import Text from "@/components/UI/Text";
import TimeAgo from "@/components/UI/TimeAgo";
import UserTag from "@/components/UI/UserTag";
import { auth0 } from "@/lib/auth0";
import { createComment } from "@/lib/actions/posts";
import { getCurrentUser } from "@/lib/data/user";
import { Comment } from "@/lib/types/types";
import Link from "next/link";
import LikeButton from "@/components/Post/Content/Buttons/LikeButton";
import DeleteButton from "./Buttons/DeleteButton";
import ShareButton from "./Buttons/ShareButton";

interface PostInfoProps {
  uploader: string;
  uploader_id: string;
  description: string;
  comments: Comment[];
  postId: string;
  timestamp: Date;
  likeCount: number;
  userLiked: boolean;
}

const PostInfo = async ({
  description,
  uploader,
  uploader_id,
  comments,
  postId,
  timestamp,
  likeCount,
  userLiked,
}: PostInfoProps) => {
  const session = await auth0.getSession();
  const user = await getCurrentUser();
  const isPostOwner = user?.user_id === uploader_id;

  return (
    <div className="border lg:flex flex-1 flex-col p-6 w-full h-full flex-1 overflow-auto">
      <div className="border-b-2 mb-4">
        <div className="mb-4">
          <UserTag username={uploader}></UserTag>
        </div>
        <div className="mb-4">
          <Text>{description}</Text>
          <TimeAgo timestamp={timestamp}></TimeAgo>
        </div>

        {/* Post Actions */}
        <div className="flex gap-4 mb-2 justify-between">
          <div className="flex gap-4">
            <LikeButton
              postId={postId}
              totalLikes={likeCount}
              userLiked={userLiked}
            ></LikeButton>
          </div>
          <div className="flex gap-2">
            <ShareButton postId={postId} />
            {isPostOwner && <DeleteButton postId={postId} />}
          </div>
        </div>
      </div>
      {/* Comment Section */}
      <div className="">
        <div className="mb-2 font-bold">{comments.length} Comments</div>
        {session && user ? (
          <CommentBox
            createComment={createComment}
            postId={postId}
          ></CommentBox>
        ) : session && !user ? (
          <Link href={`/account`}>
            <div className="text-center mb-4 p-4 border cursor-pointer font-bold">
              Set up your account to comment
            </div>
          </Link>
        ) : (
          <a href={`/auth/login`}>
            <div className="text-center mb-4 p-4 border cursor-pointer font-bold">
              Log in to comment
            </div>
          </a>
        )}
      </div>
      <div className="">
        {comments.map((comment, i) => (
          <div className="mb-4 overflow-hidden" key={i}>
            <UserTag username={comment.commenter} comment={comment}></UserTag>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostInfo;
