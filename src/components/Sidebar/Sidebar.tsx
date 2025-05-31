"use client";

import { FaVolleyballBall } from "react-icons/fa";
import {
  GoSearch,
  GoHome,
  GoPerson,
  GoMoveToTop,
  GoInbox,
  GoKebabHorizontal,
} from "react-icons/go";
import SidebarLink from "./SidebarLink";
import SidebarHeader from "./SidebarHeader";
import { useState } from "react";
import MenuHeader from "./MenuHeader";
import MenuLink from "./MenuLink";
import BackButton from "../Input/Buttons/BackButton";

type userProps = {
  user?: {
    username: string;
    email: string;
    user_id: string;
    bio: string;
  } | null;
};

const Sidebar = ({ user }: userProps) => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  console.log("SIDEBAR RERENDER");

  const toggleMenuHandler = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const closeMenuHandler = () => {
    setMenuIsOpen(false);
  };

  return (
    <div className="flex ">
      <div
        className={`flex flex-col border-r items-center ${
          menuIsOpen ? "" : "md:w-60"
        } `}
      >
        <div className={`md:w-full p-2 ${menuIsOpen ? "w-full" : ""} `}>
          <div className="flex">
            <SidebarHeader
              title="VolleyTok"
              href="/"
              icon={<FaVolleyballBall size={24} />}
              shorten={menuIsOpen}
            />
          </div>
          <div className="flex flex-col gap-2">
            {/* Global Links */}
            <SidebarLink
              title="Home"
              href="/"
              icon={<GoHome size={24} />}
              shorten={menuIsOpen}
            />
            <SidebarLink
              title="Explore"
              href="/posts"
              icon={<GoSearch size={24} />}
              shorten={menuIsOpen}
            />
            {/* User Links */}
            {user ? (
              <>
                <SidebarLink
                  title="Profile"
                  href={`/@${user?.username}`}
                  icon={<GoPerson size={24} />}
                  shorten={menuIsOpen}
                />
                <SidebarLink
                  title="Activity"
                  href={`/activity`}
                  icon={<GoInbox size={24} />}
                  shorten={menuIsOpen}
                />
                <SidebarLink
                  title="Upload"
                  href="/upload"
                  icon={<GoMoveToTop size={24} />}
                  shorten={menuIsOpen}
                />
                <SidebarLink
                  title="More"
                  icon={<GoKebabHorizontal size={24} />}
                  onClick={toggleMenuHandler}
                  shorten={menuIsOpen}
                />
              </>
            ) : (
              <SidebarLink title="Log In" href="/auth/login" external={true} />
            )}
          </div>
        </div>
      </div>
      {/* Menu */}

      <div
        className={`relative w-[320px] p-2 border-r transition-all transition-discrete duration-300 ease-in-out ${
          menuIsOpen
            ? "opacity-100 translate-x-0 pointer-events-auto"
            : "opacity-0 -translate-x-full pointer-events-none"
        } `}
        style={{
          display: menuIsOpen ? "block" : "none",
          transitionBehavior: "allow-discrete",
        }}
      >
        <MenuHeader></MenuHeader>
        <div className="flex flex-col gap-1">
          <MenuLink title="Settings" href="/settings"></MenuLink>
          <MenuLink
            title="Log out"
            href="/auth/logout"
            external={true}
          ></MenuLink>
          {/* <MenuLink
            title="Dark mode"
            href="/"
          ></MenuLink> */}
        </div>
        <div className="absolute top-6 right-4">
          <BackButton onClick={closeMenuHandler} />
        </div>
      </div>
      {/* {menuIsOpen && (
        <div
          onClick={closeMenuHandler}
          className="fixed opacity-0 w-screen h-screen z-1 left-[376px]"
        ></div>
      )} */}
    </div>
  );
};

export default Sidebar;
