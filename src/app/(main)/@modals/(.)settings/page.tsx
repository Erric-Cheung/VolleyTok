"use server";

import EditProfileModal from "@/components/Modals/RouteModals/EditProfileModal";
import { getCurrentUser } from "@/lib/data/user";

// Modal for intercepted settings route.
export default async function SettingsModal() {
  const user = await getCurrentUser();

  if (!user) {
    return;
  }

  return (
    <EditProfileModal
      username={user.username}
      bio={user.bio ? user.bio : ""}
    ></EditProfileModal>
  );
}
