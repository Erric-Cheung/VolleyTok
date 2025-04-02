"use server";

import { auth0 } from "@/lib/auth0";
import Link from "next/link";
import SidebarLink from "./SidebarLink";
import { getCurrentUser } from "@/lib/data/user";

const Sidebar = async () => {
  const session = await auth0.getSession();
  const user = await getCurrentUser();
  console.log("SIDEBAR RERENDER");

  return (
    <div className="w-40 p-2">
      <Link href="/posts">
        <div className="m-4">VolleyTok</div>
      </Link>

      <SidebarLink title="Home" href="/" />
      <SidebarLink title="Explore" href="/posts" />
      {/* <SidebarLink title="Following" href="/following" /> */}
      {session?.user ? (
        <>
          <SidebarLink title="Profile" href={`/@${user?.username}`} />
          <SidebarLink title="Upload" href="/upload" />
          <SidebarLink title="Log Out" href="/auth/logout" />
        </>
      ) : (
        <SidebarLink title="Log In" href="/auth/login" />
      )}
    </div>
  );
};

export default Sidebar;
