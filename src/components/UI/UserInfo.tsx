import { CgProfile } from "react-icons/cg";

interface userProps {
  username: string;
  userId: string;
  avatar?: string
}

const UserInfo = ({ username }: userProps) => {
  return (
    <div className="flex mb-4">
      <span className="flex grow justify-start items-center text-center font-bold">
        <CgProfile size={40}></CgProfile>
        <div className="ml-2">{username}</div>
      </span>
      <button>Follow</button>
    </div>
  );
};

export default UserInfo;
