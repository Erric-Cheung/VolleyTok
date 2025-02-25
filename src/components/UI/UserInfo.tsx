import Link from "next/link";
import { CgProfile } from "react-icons/cg";

interface userProps {
  username: string;
  userId: string;
  avatar?: string;
}

const UserInfo = ({ username }: userProps) => {
  return (
    <div className="flex mb-4">
      <span className="flex grow justify-start items-center text-center font-bold">
        <CgProfile size={40}></CgProfile>
        <Link href={`/${username}`}>
          <div className="pl-2 hover:underline">{username}</div>
        </Link>
      </span>
    </div>
  );
};

export default UserInfo;
