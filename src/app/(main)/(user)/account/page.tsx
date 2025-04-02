"use server";

import WelcomeForm from "@/components/Form/WelcomeForm";
import PostList from "@/components/Post/PostList";
import { auth0 } from "@/lib/auth0";
import { getLatestPosts, getUsernamePosts } from "@/lib/data/post";
import { getCurrentUser } from "@/lib/data/user";

export default async function Account() {
  // Fetch posts here
  const session = await auth0.getSession();
  const user = await getCurrentUser();

  if (!session) {
    // redirect
  }

  console.log(user);

  if (!user) {
    console.log("Welcome Form");
    return <WelcomeForm></WelcomeForm>;
  }

  return <div></div>;
}
