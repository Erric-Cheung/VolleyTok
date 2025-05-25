"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

interface sidebarLinkProps {
  title: string;
  icon?: ReactElement;
  external?: boolean;
  shorten?: boolean;
  href?: string;
  onClick?: () => void;
}

const SidebarLink = ({
  title,
  href,
  icon,
  external,
  shorten,
  onClick,
}: sidebarLinkProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  const content = (
    <div
      className={` b order hover:bg-gray-300 rounded text-xs cursor-pointer${
        isActive ? "bg-gray-300 text-black" : ""
      }`}
    >
      <div className={`flex items-center gap-2 `}>
        <div className="flex w-[40px] h-[40px] items-center justify-center ">
          {icon}
        </div>
        <div
          className={`font-bold hidden md:flex ${shorten ? "md:hidden" : ""} `}
        >
          {title}
        </div>
      </div>
    </div>
  );

  if (external) {
    return <a href={href}>{content}</a>;
  }

  if (href) {
    return (
      <Link href={href} prefetch={false}>
        {content}
      </Link>
    );
  }

  return <div onClick={onClick}>{content}</div>;
};
// return (
//   <Link href={href} prefetch={false}>
//     <div
//       className={`p-1 b order hover:bg-gray-300 rounded text-xs ${
//         isActive ? "bg-gray-300 text-black" : ""
//       }`}
//     >
//       <div className="flex items-center gap-1">
//         <div className="flex w-[32px] h-[32px] items-center justify-center">
//           {icon}
//         </div>
//         <div className="font-bold">{title}</div>
//       </div>
//     </div>
//   </Link>
// );
// };

export default SidebarLink;
