import PostPreview from "./PostPreview";
import { Post } from "@/lib/types/types";

interface PostListProps {
  profile?: boolean;
  showUsername?: boolean;
  showTitle?: boolean;
  posts: Post[];
}

const PostPreviewList = ({ posts }: PostListProps) => {
  // if (posts.length === 0) {
  //   return <div className="w-full">No videos found.</div>;
  // }

  return (
    <>
      {posts.length === 0 ? (
        <div className="flex">
          <div className="flex flex-none mx-auto min-h-96 justify-center text-center items-center">
            <div className="flex">No videos found.</div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(228px,1fr))] gap-4">
          {posts.map((post, i) => (
            <PostPreview post={post} key={i}></PostPreview>
          ))}
        </div>
      )}
    </>
  );
};

export default PostPreviewList;
