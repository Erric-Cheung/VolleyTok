"use client";

import { useModal } from "../Utility/ModalContext";
import ConfirmModal from "./ConfirmModal";
import ClientOnlyPortal from "./ClientOnlyPortal";
import MessageModal from "./MessageModal";
import { ConfirmModalProps, MessageModalProps } from "@/lib/types/modals";

export default function ModalRoot() {
  const { isOpen, closeModal, type, props } = useModal();

  if (!isOpen || !type) return null;

  let ModalComponent: React.ReactElement | null = null;

  switch (type) {
    case "confirm":
      ModalComponent = (
        <ConfirmModal {...(props as ConfirmModalProps)} onClose={closeModal} />
      );

      break;
    case "message":
      ModalComponent = (
        <MessageModal {...(props as MessageModalProps)} onClose={closeModal} />
      );
      break;

    default:
      ModalComponent = null;
  }

  return (
    <ClientOnlyPortal selector="#modal">{ModalComponent}</ClientOnlyPortal>
  );
}
