interface textBoxProps {
  required?: boolean;
  name?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  label?: string;
  maxLength?: number;
  bioLength?: number;
  onChangeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const ControlledTextBox = ({
  required,
  name,
  error,
  placeholder,
  value,
  label,
  maxLength,
  bioLength,
  onChangeHandler,
}: textBoxProps) => {
  return (
    <label
      className={`font-bold flex flex-col mb-4 ${error ? "text-red-500" : ""}`}
    >
      {label}
      <textarea
        className={`border p-2 rounded font-normal ${
          error ? "border-red-500" : ""
        }`}
        required={required}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
      ></textarea>
      {maxLength && (
        <div className="font-normal text-xs mt-1">
          {bioLength} / {maxLength}
        </div>
      )}
      {error && (
        <p className="mb-4 text-red-500" aria-live="polite">
          {error}
        </p>
      )}
    </label>
  );
};

export default ControlledTextBox;
