interface textProps {
  children: React.ReactNode;
}

const Text = ({ children }: textProps) => {
  return (
    <div className="break-words break-all whitespace-pre-wrap overflow-hidden">
      {children}
    </div>
  );
};

export default Text;
