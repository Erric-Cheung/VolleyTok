"use client";

import { Post } from "@/lib/types/types";
import PostScrollVideo from "./Content/PostScrollVideo";
import { useEffect, useRef, useState } from "react";
import LikeButton from "./Content/Buttons/LikeButton";
import ShareButton from "./Content/Buttons/ShareButton";

interface PostListProps {
  initialPosts: Post[];
}

const PostScrollList = ({ initialPosts }: PostListProps) => {
  const [posts, setPosts] = useState(initialPosts);
  const [isMuted, setIsMuted] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const postRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = postRefs.current.findIndex(
              (ref) => ref === entry.target
            );
            if (index !== -1) setCurrentIndex(index);
          }
        });
      },
      {
        threshold: 0.6, // how much of the item must be visible
      }
    );

    postRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      postRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const scrollTo = (index: number) => {
    const target = postRefs.current[index];
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (posts.length === 0) {
    return (
      <div className="flex h-screen">
        <div className="flex mx-auto justify-center items-center text-center">
          <div>No more videos.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="h-screen overflow-y-scroll overflow-hidden snap-y snap-mandatory">
        {posts.map((post, i) => (
          <div
            className="h-screen snap-start flex justify-center items-center"
            key={i}
            ref={(el) => {
              postRefs.current[i] = el!;
            }} // assign each post to the ref array
          >
            {/* Post Container */}
            <div className="flex w-full gap-4 items-end justify-center">
              <div className=" h-full w-full max-h-[calc(100vh-4rem)] max-w-[calc((100vh-4rem)*9/16)]  overflow-hidden cursor-pointer">
                <div className="relative w-full h-full max-h-[calc(100vh-4rem)] max-w-[calc((100vh-4rem)*9/16)] aspect-[9/16] overflow-hidden rounded-xl bg-black">
                  <PostScrollVideo videoUrl={post.videoUrl} muted={isMuted} />
                  {/* Mute Button */}
                  <div className="absolute top-0 left-0 w-full p-4 z-10 text-white bg-gradient-to-b from-black/70 to-transparent">
                    <button
                      onClick={() => {
                        setIsMuted(!isMuted);
                      }}
                    >
                      {isMuted ? "Unmute" : "Mute"}
                    </button>
                  </div>
                  {/* Post Info */}
                  <div className="absolute bottom-0 left-0 w-full p-4 z-10 text-white bg-gradient-to-b from-transparent to-black/70">
                    <div className="flex flex-col text-sm font-bold">
                      <div className="mb-2">@{post.uploader}</div>
                      <div className="flex justify-between items-end gap-2">
                        <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                          {post.description}
                        </div>
                        <span className="shrink-0 text-xs text-gray-300">
                          {post.timeAgo}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Post Actions */}
              <div className="flex flex-col gap-4 h-full">
                <div>
                  <LikeButton
                    postId={post.post_id}
                    totalLikes={post.likes}
                    userLiked={post.user_liked}
                  />
                </div>
                <div>
                  <ShareButton />
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 flex flex-col gap-4">
          <button
            className="bg-black/70 text-white px-4 py-2 rounded"
            onClick={() => scrollTo(currentIndex - 1)}
          >
            ↑
          </button>
          <button
            className="bg-black/70 text-white px-4 py-2 rounded"
            onClick={() => scrollTo(currentIndex + 1)}
          >
            ↓
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostScrollList;
