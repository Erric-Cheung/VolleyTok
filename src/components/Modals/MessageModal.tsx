"use client";

import { useEffect, useState } from "react";

interface ModalProps {
  message: string;
  type?: "default" | "success" | "error";
  onClose: () => void;
}
const duration = 3000;
const fadeDuration = 700;

const MessageModal = ({ message, type = "default", onClose }: ModalProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setVisible(false), duration);
    const closeTimer = setTimeout(onClose, duration + fadeDuration); // Wait for fade-out

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const getColorClasses = () => {
    switch (type) {
      case "success":
        return "bg-green-500 text-white";
      case "error":
        return "bg-red-500 text-white";
      default:
        return "bg-neutral-700 text-white";
    }
  };

  return (
    <div className="fixed w-full top-[16px] pointer-events-none">
      <div className="flex items-center justify-center text-center py-[8px] ">
        <div
          role="alert"
          className={`z-[99] w-[50vw] right-[50%] py-[10px] px-[8px] font-bold rounded pointer-events-auto ${getColorClasses()} transition-opacity duration-${fadeDuration} ${
            visible ? "opacity-95" : "opacity-0"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
};
export default MessageModal;
