"use client";

import { CgProfile } from "react-icons/cg";
import Link from "next/link";

interface NotificationProps {
  username: string;
  label?: string;
}

const ActivityNotication = ({ username, label }: NotificationProps) => {
  return (
    <div className="flex">
      <span className="flex grow justify-start text-center items-center">
        <div className="self-start">
          <CgProfile size={44}></CgProfile>
        </div>
        <div className="px-2 text-left ">
          <Link href={`/@${username}`} onClick={(e) => e.stopPropagation()}>
            <div className="font-bold hover:underline text-sm leading-[18px]">
              {username}
            </div>
          </Link>
          {label && <div className="text-sm ">{label} </div>}
        </div>
      </span>
    </div>
  );
};

export default ActivityNotication;
