"use client";

import Link from "next/link";

interface menuLinkProps {
  title: string;
  external?: boolean;
  href: string;
}

const MenuLink = ({ title, href, external }: menuLinkProps) => {
  const content = (
    <div className={`flex h-[40px] b order hover:bg-gray-300 rounded mx-2`}>
      <div className="flex items-center gap-1 p-2">
        <div className="font-bold md:flex">{title}</div>
      </div>
    </div>
  );

  return external ? (
    <a href={href}>{content}</a>
  ) : (
    <Link href={href}>
      {content}
    </Link>
  );
};

export default MenuLink;
