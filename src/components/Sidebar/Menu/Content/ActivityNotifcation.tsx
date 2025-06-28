"use client";

import { CgProfile } from "react-icons/cg";
import Link from "next/link";

interface NotificationProps {
  username: string;
  label?: string;
  time?: string;
}

const ActivityNotication = ({ username, label }: NotificationProps) => {
  return (
    <div className="flex">
      <span className="flex grow justify-start text-center items-center">
        <div className="self-start">
          <CgProfile size={44}></CgProfile>
        </div>
        <div className="px-2 text-left ">
          <div className="flex w-fit">
            <Link href={`/@${username}`} onClick={(e) => e.stopPropagation()}>
              <div className="font-bold hover:underline text-sm leading-[18px]">
                {username}
              </div>
            </Link>
          </div>
          {label && <div className="text-sm ">{label} </div>}
          {label && <div className="text-xs text-gray-500 ">7 days ago</div>}
        </div>
      </span>
    </div>
  );
};

export default ActivityNotication;
