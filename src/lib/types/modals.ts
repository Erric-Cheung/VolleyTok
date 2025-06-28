export type ConfirmModalProps = {
  title: string;
  message: string;
  onConfirm: () => void | Promise<void>;
};

export type MessageModalProps = {
  message: string;
  type?: "default" | "success" | "error";
};