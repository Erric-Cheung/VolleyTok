"use server";

import FollowButton from "@/components/Input/Buttons/FollowButton";
import PostPreviewList from "@/components/Post/PostPreviewList";
import UserIcon from "@/components/UI/UserIcon";
import { auth0 } from "@/lib/auth0";
import { notFound } from "next/navigation";
import { getUsernamePosts } from "@/lib/data/post";
import {
  checkIsFollowing,
  getCurrentUser,
  getFollowerList,
  getFollowingList,
  getUser,
} from "@/lib/data/user";
import EditProfileButton from "@/components/Input/Buttons/EditProfileButton";

export default async function Profile({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const session = await auth0.getSession();
  const usernameHandle = decodeURIComponent((await params).username);
  const username = usernameHandle.slice(1);
  const currentUser = await getCurrentUser();
  const user = await getUser(username);

  // Enforce @ prefix
  if (!usernameHandle.startsWith("@") || !user) {
    notFound();
  }

  let isFollowing = false;
  let isProfileOwner = false;

  if (currentUser) {
    isProfileOwner = user.username === currentUser.username;
  }

  if (!isProfileOwner && session && currentUser) {
    isFollowing = await checkIsFollowing(currentUser.user_id, user.user_id);
  }

  const followersResult = await getFollowerList(username);
  const followingResult = await getFollowingList(username);
  const posts = await getUsernamePosts(username);
  console.log(posts);

  // const postRes = await fetch(`http://localhost:3000/api/posts?username=${username}`);
  // const data = await postRes.json();
  // console.log(data);

  return (
    <div className="flex flex-col h-full pt-4 pr-4 pl-4 ">
      <div className="flex gap-[20px] mb-4 items-center justify-items-center">
        <UserIcon></UserIcon>
        <div className="flex flex-col gap-[8px]">
          <div className="font-bold mb"> {user.username}</div>
          <div className="flex">
            {isProfileOwner ? (
              <EditProfileButton />
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
            <div className="mb-2">{user.bio ? user.bio : "No bio yet."}</div>
          </div>
        </div>
      </div>

      <div className="">
        <div className="flex">
          <div className="mb-2 border-b flex-1">Posts</div>
          {/* <div className="mb-2 border-b flex-1">Liked</div>
          <div className="mb-2 border-b flex-1">Saved</div> */}
        </div>
        <PostPreviewList posts={posts ? posts : []} />
      </div>
    </div>
  );
}
