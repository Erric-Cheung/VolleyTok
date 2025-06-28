"use client";

import { ConfirmModalProps, MessageModalProps } from "@/lib/types/modals";
import { createContext, useContext, useState, ReactNode } from "react";

type ModalPropsMap = {
  confirm: ConfirmModalProps;
  message: MessageModalProps;
};

type ModalType = keyof ModalPropsMap;

type ModalContextType = {
  openModal: <T extends ModalType>(type: T, props: ModalPropsMap[T]) => void;
  closeModal: () => void;
  isOpen: boolean;
  type: ModalType | null;
  props: ModalPropsMap[ModalType] | null;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ModalType | null>(null);
  const [props, setProps] = useState<ModalPropsMap[ModalType] | null>(null);

  const openModal = <T extends ModalType>(type: T, props: ModalPropsMap[T]) => {
    setType(type);
    setProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setType(null);
    setProps(null);
  };

  return (
    <ModalContext.Provider
      value={{ isOpen, openModal, closeModal, type, props }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};
