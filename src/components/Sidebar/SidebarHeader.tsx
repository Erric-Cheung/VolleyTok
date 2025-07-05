import Link from "next/link";
import { ReactElement } from "react";

interface sidebarHeaderProps {
  title: string;
  href: string;
  icon?: ReactElement;
  external?: boolean;
  shorten?: boolean;
}

const SidebarHeader = ({ title, href, icon, shorten }: sidebarHeaderProps) => {
  return (
    <Link href={href} prefetch={false}>
      <div className="p-1 rounded mb-4">
        <div className="flex items-center gap-2">
          <div className="flex w-[32px] h-[32px] items-center justify-center">
            {icon}
          </div>
          {!shorten && <div className="font-bold hidden lg:block">{title}</div>}
        </div>
      </div>
    </Link>
  );
};

export default SidebarHeader;
