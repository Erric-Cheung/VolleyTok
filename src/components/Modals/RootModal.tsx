"use client";

import { useEffect, useState } from "react";
import { useModal } from "../Utility/ModalContext";
import ConfirmModal from "./ConfirmModal";
import ClientOnlyPortal from "./ClientOnlyPortal";
import MessageModal from "./MessageModal";

export default function ModalRoot() {
  const { isOpen, closeModal, type, props } = useModal();

  if (!isOpen || !type) return null;

  let ModalComponent: React.ReactElement | null = null;

  switch (type) {
    case "confirm":
      ModalComponent = (
        <ConfirmModal
          title={props.title}
          message={props.message}
          onConfirm={props.onConfirm}
          onClose={closeModal}
        />
      );
      break;
    case "message":
      ModalComponent = (
        <MessageModal
          message={props.message}
          type={props.type}
          onClose={closeModal}
        />
      );
      break;
      
    default:
      ModalComponent = null;
  }

  return (
    <ClientOnlyPortal selector="#modal">{ModalComponent}</ClientOnlyPortal>
  );
}
