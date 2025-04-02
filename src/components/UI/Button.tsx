interface buttonProps {
  onClick: (e: React.MouseEvent) => {};
  color?: string;
  children: React.ReactNode;
}
const Button = ({ color, onClick, children }: buttonProps) => {
  return (
    <button
      className="flex items-center justify-center border rounded font-medium hover:bg-gray-100"
      onClick={onClick}
    >
      <div className="flex items-center justify-center h-[40px] mx-[16px]">
        {children}
      </div>
    </button>
  );
};

export default Button;
