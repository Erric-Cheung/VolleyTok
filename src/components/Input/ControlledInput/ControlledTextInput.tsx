"use client";

interface textInputProps {
  required?: boolean;
  name?: string;
  error?: string;
  placeholder?: string;
  value?: string;
  label?: string;
  onChangeHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlledTextInput = ({
  required,
  name,
  error,
  label,
  placeholder,
  value,
  onChangeHandler,
}: textInputProps) => {
  return (
    <label
      className={`font-bold flex flex-col mb-4 ${error ? "text-red-500" : ""}`}
    >
      {label}
      <input
        className={`border p-2 rounded font-normal mb-1 ${
          error ? "border-red-500" : ""
        }`}
        type="text"
        required={required}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChangeHandler}
      ></input>
      {error && (
        <p className="text-red-500 font-ns text-xs" aria-live="polite">
          {error}
        </p>
      )}
    </label>
  );
};

export default ControlledTextInput;
