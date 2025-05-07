"use server";

import EditProfileModal from "@/components/Modals/EditProfileModal";
import { getCurrentUser } from "@/lib/data/user";

export default async function SettingModal() {
  const user = await getCurrentUser();

  if(!user){

  }

  return (
    <EditProfileModal
      username={user?.username}
      bio={user?.bio}
    ></EditProfileModal>
  );
}
