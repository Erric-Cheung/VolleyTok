"use client";

import { useUser } from "@auth0/nextjs-auth0";
import Link from "next/link";

const Header = () => {
  const onClickHandler = () => {
    // Change Theme (Night/Day)
  };

  const { user, error, isLoading } = useUser();

  return (
    <header className="flex items-center h-[60px] p-4">
      <span className="group flex align-center items-center cursor-pointer grow ">
        <div className="">
          <Link href="/">VolleyTok</Link>
        </div>
      </span>
      {!isLoading && user && (
        <a href="/upload">
          <div className="mr-4 p-2">Upload Video</div>
        </a>
      )}
      {!isLoading && user && (
        <a href="/auth/logout">
          <div className="bg-red-500 p-2">Logout</div>
        </a>
      )}
      {!isLoading && !user && (
        <a href="/auth/login">
          <div className="bg-red-500 p-2">Login</div>
        </a>
      )}
    </header>
  );
};

export default Header;
