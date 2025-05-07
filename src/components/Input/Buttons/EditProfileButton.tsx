"use client";

import { useRouter } from "next/navigation";
import Button from "../../UI/Button";
import { pushRoute } from "@/lib/utils/util";

const EditProfileButton = () => {
  const router = useRouter();
  const followHandler = async (e: React.MouseEvent) => {
    e.preventDefault();
    // sessionStorage.setItem("modal:fromPath", window.location.pathname);
    // pushRoute('/settings')
    router.push(`/settings`);
  };

  return <Button onClick={followHandler}>Edit Profile</Button>;
};

export default EditProfileButton;
