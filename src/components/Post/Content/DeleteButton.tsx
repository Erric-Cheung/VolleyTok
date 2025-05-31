"use client";

import IconButton from "@/components/UI/IconButton";
import { FiTrash } from "react-icons/fi";

const DeleteButton = ({ postId }: { postId: string }) => {
  const handleDelete = () => {};

  return (
    <IconButton
      onClick={handleDelete}
      icon={<FiTrash size={24} className="" />}
    ></IconButton>
  );
};

export default DeleteButton;
