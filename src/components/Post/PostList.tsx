import PostPreview from "./PostPreview";
import { Post } from "@/lib/types/types";

interface PostListProps {
  profile?: boolean;
  showUsername?: boolean;
  showTitle?: boolean;
  posts: Post[];
}

const PostList = ({ posts }: PostListProps) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(256px,1fr))]">
      {posts.map((post, i) => (
        <PostPreview
          post={post}
          key={i}
        ></PostPreview>
      ))}
    </div>
  );
};

export default PostList;
