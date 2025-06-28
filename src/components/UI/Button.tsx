interface buttonProps {
  onClick: (e: React.MouseEvent) => void;
  color?: string;
  children: React.ReactNode;
  disabled?: boolean;
}
const Button = ({  onClick, children, disabled }: buttonProps) => {
  const baseClasses = "flex items-center justify-center border rounded font-medium";
  const enabledClasses = "hover:bg-gray-100 cursor-pointer";
  const disabledClasses = "bg-gray-200 text-gray-500 cursor-not-allowed";
  return (
    <button
      className={`${baseClasses} ${
        disabled ? disabledClasses : enabledClasses
      }`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className="flex items-center justify-center h-[40px] mx-[16px]">
        {children}
      </div>
    </button>
  );
};

export default Button;
