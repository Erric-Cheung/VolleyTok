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
import { useEffect, useState } from "react";
import RootMenu from "./Menu/RootMenu";
import { usePathname } from "next/navigation";

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
  const [menu, setMenu] = useState<"none" | "Activity" | "More">("none");
  const pathname = usePathname();

  const toggleMenuHandler = (menuType: "Activity" | "More") => {
    if (menuIsOpen && menu === menuType) {
      setMenu("none");
      setMenuIsOpen(false);
    } else {
      setMenu(menuType);
      setMenuIsOpen(true);
    }
  };
  const closeMenuHandler = () => {
    setMenu("none");
    setMenuIsOpen(false);
  };

  // Close menu on link change
  useEffect(() => {
    closeMenuHandler();
  }, [pathname]);

  return (
    <>
      <div className="flex relative bg-white">
        <div className={`flex flex-col ${menuIsOpen ? "md:w-60" : "md:w-60"} `}>
          <div
            className={`p-2 z-50 ${
              menuIsOpen ? "md:w-fit" : ""
            } bg-white h-full`}
          >
            <div className="flex ">
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
                isActive={!menuIsOpen && pathname === "/"}
              />
              <SidebarLink
                title="Explore"
                href="/posts"
                icon={<GoSearch size={24} />}
                shorten={menuIsOpen}
                isActive={!menuIsOpen && pathname === "/posts"}
              />
              {/* User Links */}
              {user ? (
                <>
                  <SidebarLink
                    title="Activity"
                    icon={<GoInbox size={24} />}
                    onClick={() => {
                      toggleMenuHandler("Activity");
                    }}
                    shorten={menuIsOpen}
                    isActive={menuIsOpen && menu === "Activity"}
                  />
                  <SidebarLink
                    title="Upload"
                    href="/upload"
                    icon={<GoMoveToTop size={24} />}
                    shorten={menuIsOpen}
                    isActive={!menuIsOpen && pathname === "/upload"}
                  />
                  <SidebarLink
                    title="Profile"
                    href={`/@${user?.username}`}
                    icon={<GoPerson size={24} />}
                    shorten={menuIsOpen}
                    isActive={!menuIsOpen && pathname === `/@${user?.username}`}
                  />
                  <SidebarLink
                    title="More"
                    icon={<GoKebabHorizontal size={24} />}
                    onClick={() => {
                      toggleMenuHandler("More");
                    }}
                    shorten={menuIsOpen}
                    isActive={menuIsOpen && menu === "More"}
                  />
                </>
              ) : (
                <SidebarLink
                  title="Log In"
                  href="/auth/login"
                  external={true}
                />
              )}
            </div>
          </div>
        </div>
        <RootMenu
          menu={menu}
          menuIsOpen={menuIsOpen}
          closeMenu={closeMenuHandler}
        ></RootMenu>
      </div>
      {menuIsOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20"
          onClick={closeMenuHandler}
        />
      )}
    </>
  );
};

export default Sidebar;
