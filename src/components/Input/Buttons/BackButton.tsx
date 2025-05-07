"use client";

import { MdClose } from "react-icons/md";

import { useNavigate } from "@/lib/utils/useNavigate";

const BackButton = () => {
  const { back } = useNavigate();
  return (
    <button
      onClick={() => {
        back();
      }}
    >
      <MdClose size={24}></MdClose>
    </button>
  );
};

export default BackButton;
