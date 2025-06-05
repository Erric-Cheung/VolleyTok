"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ModalType = "confirm" | "message" | "error"; 

type ModalContextType = {
  openModal: (type: ModalType, props?: Record<string, any>) => void;
  closeModal: () => void;
  isOpen: boolean;
  type: ModalType | null;
  props: Record<string, any>;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<ModalType | null>(null);
  const [props, setProps] = useState<Record<string, any>>({});

  const openModal = (type: ModalType, props: Record<string, any> = {}) => {
    setType(type);
    setProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setType(null);
    setProps({});
  };

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, type, props }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
};