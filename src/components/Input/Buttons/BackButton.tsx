"use client";

import { MdClose } from "react-icons/md";

import { useNavigate } from "@/lib/utils/useNavigate";

interface buttonProps {
  onClick?: () => void;
}
const BackButton = ({ onClick }: buttonProps) => {
  const { back } = useNavigate();

  if (onClick) {
    return (
      <div className="flex rounded-full bg-gray-200 h-[28px] w-[28px] justify-center">
        <button onClick={onClick}>
          <MdClose size={16}></MdClose>
        </button>
      </div>
    );
  }

  return (
    <div className="flex rounded-full bg-gray-200 h-[28px] w-[28px] justify-center">
      <button
        onClick={() => {
          back();
        }}
      >
        <MdClose size={16}></MdClose>
      </button>
    </div>
  );
};

export default BackButton;
