"use client";

import { Post } from "@/lib/types/types";
import PostScrollVideo from "./Content/PostScrollVideo";
import { useEffect, useRef, useState } from "react";
import LikeButton from "./Content/Buttons/LikeButton";
import ShareButton from "./Content/Buttons/ShareButton";
import MuteButton from "./Content/Buttons/MuteButton";
import IconButton from "../UI/IconButton";
import { GoArrowDown, GoArrowUp } from "react-icons/go";

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
      <div className="h-screen overflow-y-scroll overflow-hidden snap-y snap-mandatory px-4 no-scrollbar">
        {posts.map((post, i) => (
          <div
            className="h-screen snap-start flex justify-center items-center"
            key={i}
            ref={(el) => {
              postRefs.current[i] = el!;
            }} // assign each post to the ref array
          >
            {/* Post Container */}
            <div className="flex flex-col w-full gap-2 items-center justify-center sm:flex-row sm:items-end">
              <div className=" h-full w-full min-w-[240px] max-h-[calc(100vh-4rem)] max-w-[calc((100vh-4rem)*9/16)] overflow-hidden cursor-pointer ">
                <div className="relative w-full h-full max-h-[calc(100vh-4rem)] max-w-[calc((100vh-4rem)*9/16)] aspect-[9/16] overflow-hidden rounded-xl bg-black">
                  <PostScrollVideo videoUrl={post.videoUrl} muted={isMuted} />
                  {/* Mute Button */}
                  <div className="absolute top-0 left-0 w-full p-4 z-10 text-white bg-gradient-to-b from-black/70 to-transparent">
                    <MuteButton
                      toggleMute={() => {
                        setIsMuted(!isMuted);
                      }}
                      isMuted={isMuted}
                    />
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
              <div className="flex gap-4 h-full sm:grow-0 sm:flex-col">
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
        <div className="hidden sm:flex flex-col gap-4 absolute right-4 top-1/2 transform -translate-y-1/2 z-30 sm:flex">
          <button
            className={`rounded bg-gray-200 p-2 ${currentIndex <= 0 ? "opacity-50" : ""}` }
            disabled={currentIndex <= 0}
            onClick={() => scrollTo(currentIndex - 1)}
          >
            <GoArrowUp size={20} />
          </button>
          <button
            className={`rounded bg-gray-200 p-2 ${currentIndex >= posts.length - 1 ? "opacity-50" : ""}`}
            disabled={currentIndex >= posts.length - 1}
            onClick={() => scrollTo(currentIndex + 1)}
            >
            <GoArrowDown size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostScrollList;
