'use client'

import { Comment } from "@/lib/types/types";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import Text from "./Text";

interface userProps {
  username: string;
  label?: string;
  comment?: Comment;
}

const UserTag = ({ username, comment, label }: userProps) => {
  return (
    <div className="flex">
      <span className="flex grow justify-start text-center items-center">
        <div className="self-start">
          <CgProfile size={32}></CgProfile>
        </div>
        <div className="pl-2 text-left ">
          <Link href={`/@${username}`} onClick={(e) => e.stopPropagation()}>
            <div className="font-bold hover:underline ">{username}</div>
          </Link>
          {comment && <Text>{comment.comment}</Text>}
          {label && <Text>{label}</Text>}
        </div>
      </span>
    </div>
  );
};

export default UserTag;
