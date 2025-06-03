"use client";

interface ModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal = ({ title, message, onConfirm, onClose }: ModalProps) => {
  console.log("CONFIRM MODAL");
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]" onClick={onClose}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4 ">{title}</h2>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-2">

          <button className="border text-gray-600 px-4 py-2 rounded" onClick={onClose}>Cancel</button>
          <button className=" bg-red-500 text-white px-4 py-2 rounded" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
