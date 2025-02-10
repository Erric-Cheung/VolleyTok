interface userProps {
  required?: boolean;
  children: React.ReactNode;
  name?: string;
  error?: string;
}

const TextInput = ({ required, name, error, children }: userProps) => {
  return (
    <label className={`font-bold flex flex-col mb-4 ${error ? "text-red-500" : ""}`}>
      {children}
      <input
        className={`border p-2 rounded font-normal ${error ? "border-red-500" : ""}`}
        type="text"
        required={required}
        name={name}
      ></input>
      {error && (
        <p className="text-red-500" aria-live="polite">
          {error}
        </p>
      )}
    </label>
  );
};

export default TextInput;
