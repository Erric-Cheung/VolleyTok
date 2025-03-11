"use server";

import CommentBox from "@/components/Input/CommentBox";
import Text from "@/components/UI/Text";
import TimeAgo from "@/components/UI/TimeAgo";
import UserTag from "@/components/UI/UserTag";
import { createComment } from "@/lib/actions/posts";
import { auth0 } from "@/lib/auth0";
import { Comment } from "@/lib/types/types";

interface PostInfoProps {
  uploader: string;
  description: string;
  comments: Comment[];
  postId: string;
  timestamp: Date;
}

const PostInfo = async ({
  description,
  uploader,
  comments,
  postId,
  timestamp,
}: PostInfoProps) => {
  const session = await auth0.getSession();

  return (
    <div className="border lg:flex flex-1 flex-col p-6 w-full h-full flex-1 overflow-auto">
      <div className="">
        <div className="mb-4">
          <UserTag username={uploader}></UserTag>
        </div>
        <div className="mb-4">
          <Text>{description}</Text>
          <TimeAgo timestamp={timestamp}></TimeAgo>
        </div>
        <ul className="flex gap-2">
          {/* <li>Like</li>
          <li>Bookmark</li>
          <li>Share</li> */}
        </ul>
      </div>

      <div className="border-b-2 border-black mb-4">
        <div className="mb-2 font-bold">{comments.length} Comments</div>
        {session?.user ? (
          <CommentBox
            createComment={createComment}
            postId={postId}
          ></CommentBox>
        ) : (
          <div className="text-center mb-4 p-4 border cursor-pointer">Log in to comment</div>
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
