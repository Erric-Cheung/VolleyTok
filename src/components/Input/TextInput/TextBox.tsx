interface userProps {
  required?: boolean;
  children: React.ReactNode;
  name?: string;
  error?: string;
  placeholder?: string;
}

const TextBox = ({ required, name, error, children, placeholder}: userProps) => {
  return (
    <label className={`font-bold flex flex-col mb-4 ${error ? "text-red-500" : ""}`}>
      {children}
      <textarea
        className={`border p-2 rounded font-normal ${error ? "border-red-500" : ""}`}
        required={required}
        name={name}
        placeholder={placeholder}
      ></textarea>
      {error && (
        <p className="mb-4 text-red-500" aria-live="polite">
          {error}
        </p>
      )}
    </label>
  );
};

export default TextBox;
