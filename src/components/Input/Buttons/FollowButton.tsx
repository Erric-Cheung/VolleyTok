"use client";

import { followUser, unfollowUser } from "@/lib/actions/user";
import { useState } from "react";
import Button from "../../UI/Button";

const FollowButton = ({
  userId,
  isFollowing,
}: {
  userId: string;
  isFollowing: boolean;
}) => {
  const [localFollowing, setLocalFollowing] = useState(isFollowing);
  const followHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    const action = localFollowing ? unfollowUser : followUser;
    const result = await action(userId);

    if (result.error) {
    }
    setLocalFollowing(!localFollowing);
  };

  // const followHandler = async (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   const type = localFollowing ? "unfollow" : "follow";
  //   const res = await fetch("/api/follow", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ type, userId }),
  //   });
  //   const data = await res.json();

  //   if (!res.ok || data.error) {
  //     console.log(data.error);
  //     return;
  //   }

  //   setLocalFollowing(!localFollowing);
  // };

  return (
    <Button onClick={followHandler}>
      {localFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};

export default FollowButton;
