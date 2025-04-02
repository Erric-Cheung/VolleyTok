"use server";

import Button from "@/components/UI/Button";
import FollowButton from "@/components/Input/Buttons/FollowButton";
import PostList from "@/components/Post/PostList";
import UserIcon from "@/components/UI/UserIcon";
import { followUser, unfollowUser } from "@/lib/actions/user";
import { auth0 } from "@/lib/auth0";
import { getUsernamePosts } from "@/lib/data/post";
import {
  checkIsFollowing,
  getFollowerList,
  getFollowingList,
  getUser,
} from "@/lib/data/user";
import { notFound } from "next/navigation";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth0.getSession();
  const usernameHandle = decodeURIComponent((await params).username);
  const username = usernameHandle.slice(1);
  const user = await getUser(username);

  // Enforce @ prefix
  if (!usernameHandle.startsWith("@") || !user) {
    notFound();
  }

  const posts = await getUsernamePosts(username);
  const isProfileOwner = user.user_id === session?.user.sub;
  let isFollowing;

  if (!isProfileOwner && session) {
    isFollowing = await checkIsFollowing(session.user.sub, user.user_id);
  }

  const followersResult = await getFollowerList(username);
  const followingResult = await getFollowingList(username);

  console.log(followingResult);

  return (
    <div className="flex flex-col h-full pt-4 pr-4 pl-4 ">
      <div className="flex gap-[20px] mb-4 items-center justify-items-center">
        <UserIcon></UserIcon>
        <div className="flex flex-col gap-[8px]">
          <div className="font-bold mb"> {user.username}</div>
          <div className="flex">
            {isProfileOwner ? (
              <Button onClick={unfollowUser.bind(null, user.user_id)}>
                Edit Profile
              </Button>
            ) : (
              <FollowButton
                userId={user.user_id}
                isFollowing={isFollowing}
              ></FollowButton>
            )}
          </div>
          <div className="flex flex-col">
            <div className="flex">
              <div className="mr-2">
                <span className="font-bold">
                  {followersResult.followerCount}
                </span>
                <span className="ml-1">Followers</span>
              </div>
              <div className="mr-2">
                <span className="font-bold">
                  {followingResult.followingCount}
                </span>
                <span className="ml-1">Following</span>
              </div>
            </div>
            <div className="mb-2">No bio yet.</div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex">
          <div className="mb-2 border-b flex-1">Posts</div>
          <div className="mb-2 border-b flex-1">Liked</div>
          <div className="mb-2 border-b flex-1">Saved</div>
        </div>
        <PostList posts={posts}></PostList>
      </div>
    </div>
  );
}
