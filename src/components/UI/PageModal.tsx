"use client";

import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

const PageModal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // Hides background scrollbar before repaint
  useLayoutEffect(() => {
    document.body.style.overflow = "hidden"; // Prevent body scrolling

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const onKeyDownHandler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        router.back();
      }
    };
    window.addEventListener("keydown", onKeyDownHandler);

    return () => window.removeEventListener("keydown", onKeyDownHandler);
  }, [router]);

  const onClickHandler = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center">
      <div className="flex bg-white shadow-lg w-full h-full">
        <div className="absolute top-[20px] left-[20px] text-white z-[1]">
          <button
            className="p-2 bg-gray-500 w-[40px] h-[40px] rounded-full"
            onClick={onClickHandler}
          >
            X
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PageModal;
