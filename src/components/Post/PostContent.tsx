import UserInfo from "../UI/UserInfo";
import { Post } from "@/lib/types/types";

interface PostContentProps {
  post: Post;
}

const PostContent = ({ post }: PostContentProps) => {
  return (
    <div className="flex max-h-[calc(100vh-60px)] p-4 flex-col lg:flex-row">
      <div className="flex max-h-[calc(100vh-60px)] aspect-[0.7/1] items-center">
        <div className="flex h-full items-center rounded ">
          <div className="rounded h-full overflow-hidden">
            <video
              className="w-full h-full object-contain bg-black"
              controls
              autoPlay
              muted
            >
              <source src={post.videoUrl} type="video/mp4"></source>
            </video>
          </div>
        </div>
      </div>
      <div className="lg:w-[480px] border lg:flex flex-1 flex-col p-6">
        <div className="">
          <UserInfo username={post.uploader} userId={post.uploader}></UserInfo>
          <div className="mb-4">{post.description}</div>
          {/* <ul className="flex gap-2 mb-4">
            <li>Like</li>
            <li>Bookmark</li>
            <li>Share</li>
          </ul> */}
        </div>
        <div>
          <div className="">Comments</div>
          {/* <ul>
            <li>Comment 1</li>
            <li>Comment 2</li>
            <li>Comment 3</li>
            <li>Comment 4</li>
          </ul> */}
        </div>
      </div>
    </div>
  );
};

export default PostContent;
