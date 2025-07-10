"use client";

import { useEffect, useRef, useState } from "react";

const PostScrollVideo = ({
  videoUrl,
  muted,
}: {
  videoUrl: string;
  muted?: boolean;
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Observe visibility of the video container
  useEffect(() => {
    const currentRef = containerRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        // 75% in view to trigger
        threshold: 0.75,
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isVisible) {
      videoRef.current.play().catch((e) => {
        console.log("Autoplay failed:", e);
      });
    } else {
      videoRef.current.pause();
    }
  }, [isVisible]);

  // Handle click to pause/play manually
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  };

  return (
    <div className="relative flex h-full w-full items-center rounded justify-center overflow-hidden">
      <div
        className="rounded w-full h-full overflow-hidden"
        ref={containerRef}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="absolute w-full h-full object-contain bg-black"
          playsInline
          loop
          preload="none"
          muted={muted}
        >
          <source src={videoUrl} type="video/mp4"></source>
        </video>
      </div>
    </div>
  );
};

export default PostScrollVideo;
