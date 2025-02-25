"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Post } from "@/lib/types/types";

interface PostPreviewProps {
  post: Post;
  showUsername?: boolean;
  showTitle?: boolean;
}

const PostPreview = ({ post}: PostPreviewProps) => {
  const router = useRouter();

  const onMouseEnterHandler = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.play();
  };

  const onMouseLeaveHandler = (event: React.MouseEvent<HTMLVideoElement>) => {
    event.currentTarget.pause();
    event.currentTarget.currentTime = 0;
  };

  const onClickHandler = () => {
    // intercepting route
    router.push(`/posts/${post.file_id}`);
  };

  // href for link
  return (
    <div className="mr-6">
      <Link href={`/posts/${post.file_id}`}>
        <div className="relative w-full overflow-hidden cursor-pointer">
          <div className="relative pt-[133.333%] w-full overflow-hidden">
            <div className="">
              <video
                onMouseEnter={onMouseEnterHandler}
                onMouseLeave={onMouseLeaveHandler}
                onClick={onClickHandler}
                className="absolute top-0 left-0 w-full h-full object-cover bg-black rounded"
                muted
              >
                <source src={post.videoUrl} type="video/mp4"></source>
              </video>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-2 pt-1 font-bold text-sm ">
        <div className="flex justify-between">
          <span>{post.title}</span>
          <span>{post.timeAgo}</span>
        </div>
        <div className="">{post.uploader}</div>
      </div>
    </div>
  );
};

export default PostPreview;
