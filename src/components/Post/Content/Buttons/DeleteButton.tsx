"use client";

import IconButton from "@/components/UI/IconButton";
import { useModal } from "@/components/Utility/ModalContext";
import { deletePost } from "@/lib/actions/posts";
import { useNavigate } from "@/lib/utils/useNavigate";
import { FiTrash } from "react-icons/fi";

const DeleteButton = ({ postId }: { postId: string }) => {
  const { openModal } = useModal();
  const { back } = useNavigate();

  return (
    <IconButton
      onClick={() =>
        openModal("confirm", {
          title: "Delete this post?",
          message: "Are you sure you want to delete this post?",
          onConfirm: async () => {
            const res = await deletePost(postId);
            console.log(res);
            if (res.success) {
              back();
            }
          },
        })
      }
      icon={<FiTrash size={24} className="" />}
    ></IconButton>
  );
};

export default DeleteButton;
