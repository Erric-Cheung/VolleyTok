import { ReactElement } from "react";

interface buttonProps {
  onClick: (e: React.MouseEvent) => void;
  icon?: ReactElement;
  disabled?: boolean;
  label?: string;
}

const IconButton = ({ onClick, icon, disabled, label }: buttonProps) => {
  return (
    <button
      className="flex py-2 px-2 justify-center items-center rounded-full bg-gray-200 hover:bg-gray-300"
      onClick={onClick}
    >
      <span className="flex items-center justify-center">
        <div className="justify-center">{icon}</div>
        {label && <div className="ml-2 text-xs">{label}</div>}
      </span>
    </button>
  );
};

export default IconButton;
