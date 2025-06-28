"use client";

import { useRouter } from "next/navigation";
import Button from "../../UI/Button";

const EditProfileButton = () => {
  const router = useRouter();
  const followHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    router.push(`/settings`);
  };

  return <Button onClick={followHandler}>Edit Profile</Button>;
};

export default EditProfileButton;
