"use server";

import { auth0 } from "@/lib/auth0";
import Link from "next/link";

const Header = async () => {
  const session = await auth0.getSession();

  return (
    <header className="flex items-center h-[60px] p-4">
      <span className="group flex align-center items-center cursor-pointer grow ">
        <div className="">
          <Link href="/posts">VolleyTok</Link>
        </div>
      </span>
      {session?.user ? (
        <>
          <Link href="/upload">
            <div className="mr-4 p-2">Upload Video</div>
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/auth/logout">
            <div className="bg-red-500 p-2">Logout</div>
          </a>
        </>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/auth/login">
            <div className="bg-red-500 p-2">Login</div>
          </a>
        </>
      )}
    </header>
  );
};

export default Header;
