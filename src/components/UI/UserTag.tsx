import { Comment } from "@/lib/types/types";
import { CgProfile } from "react-icons/cg";
import Link from "next/link";
import Text from "./Text";

interface userProps {
  username: string;
  comment?: Comment;
}

const UserTag = ({ username, comment }: userProps) => {
  return (
    <div className="flex">
      <span className="flex grow justify-start text-center items-center">
        <div className="self-start">
          <CgProfile size={32}></CgProfile>
        </div>
        <div className="pl-2 text-left ">
          <Link href={`/${username}`}>
            <div className="font-bold hover:underline ">{username}</div>
          </Link>
          {comment && <Text>{comment.comment}</Text>}
        </div>
      </span>
    </div>
  );
};

export default UserTag;
