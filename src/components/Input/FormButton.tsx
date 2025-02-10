interface userProps {
    pending?: boolean;
    children: React.ReactNode;
  }

const FormButton =({ pending, children }: userProps) => {
  return (
    <button
      className="border pt-2 pb-2 pr-4 pl-4 rounded"
      type="submit"
      disabled={pending}
    >
      {children}
    </button>
  );
};

export default FormButton;
