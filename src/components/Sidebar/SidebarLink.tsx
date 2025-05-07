"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface sidebarLinkProps {
  title: string;
  href: string;
}

const SidebarLink = ({ title, href }: sidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link href={href} prefetch={false}>
      <div
        className={`p-2 b order hover:bg-gray-300 rounded text-xs ${
          isActive ? "bg-gray-300 text-black" : ""
        }`}
      >
        {title}
      </div>
    </Link>
  );
};

export default SidebarLink;
