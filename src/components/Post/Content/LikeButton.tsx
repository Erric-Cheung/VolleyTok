"use client";

import IconButton from "@/components/UI/IconButton";
import { likePost, unlikePost } from "@/lib/actions/posts";
import { useState } from "react";
import { FiHeart } from "react-icons/fi";

const LikeButton = ({
  postId,
  totalLikes,
  userLiked,
}: {
  postId: string;
  totalLikes: number;
  userLiked: boolean;
}) => {
  const [isLiked, setIsLiked] = useState(userLiked);
  const [likeCount, setLikeCount] = useState(totalLikes);
  const handleLike = async () => {
    const res = isLiked ? await unlikePost(postId) : await likePost(postId);
    if (!res?.success) {
      return;
    }
    setLikeCount(res.likeCount);
    setIsLiked(!isLiked)
  };

  console.log(isLiked)

  return (
    <IconButton
      onClick={handleLike}
      label={`${likeCount}`}
      icon={
        <FiHeart
          size={24}
          className={`transition-colors ${
            isLiked ? "fill-black hover:fill-gray-200" : "fill-gray-200 hover:fill-black"
          }`}
        />
      }
    ></IconButton>
  );
};

export default LikeButton;
