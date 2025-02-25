import UserInfo from "@/components/UI/UserInfo";

interface PostInfoProps {
  uploader: string;
  description: string;
}

const PostInfo = ({ description, uploader }: PostInfoProps) => {
  return (
    <div className="border lg:flex flex-1 flex-col p-6 w-full">
      <div className="">
        <UserInfo username={uploader} userId={uploader}></UserInfo>
        <div className="mb-4">{description}</div>
        {/* <ul className="flex gap-2 mb-4">
        <li>Like</li>
        <li>Bookmark</li>
        <li>Share</li>
      </ul> */}
      </div>
      <div>
        <div className="">Comments</div>
        {/* <ul>
        <li>Comment 1</li>
        <li>Comment 2</li>
        <li>Comment 3</li>
        <li>Comment 4</li>
      </ul> */}
      </div>
    </div>
  );
};

export default PostInfo;
