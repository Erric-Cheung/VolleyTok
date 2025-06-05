"use client";

import IconButton from "@/components/UI/IconButton";
import { useModal } from "@/components/Utility/ModalContext";
import { FiLink } from "react-icons/fi";

const ShareButton = ({ postId }: { postId: string }) => {
  const { openModal } = useModal();

  return (
    <IconButton
      onClick={() => {
        const url = window.location.href;
        navigator.clipboard.writeText(url);
        openModal("message", {
          message: "Copied to clipboard.",
          type: "default",
        });
      }}
      icon={<FiLink size={24} className="" />}
    ></IconButton>
  );
};

export default ShareButton;
