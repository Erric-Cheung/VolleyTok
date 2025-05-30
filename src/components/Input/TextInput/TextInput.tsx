"use client";

import { useState } from "react";

interface userProps {
  required?: boolean;
  children?: React.ReactNode;
  name?: string;
  error?: string;
  placeholder?: string;
  value?: string;
}

const TextInput = ({
  required,
  name,
  error,
  children,
  placeholder,
  value,
}: userProps) => {
  const [textValue, setTextValue] = useState(value || "");

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.currentTarget.value);
  };

  return (
    <label
      className={`font-bold flex flex-col mb-4 ${error ? "text-red-500" : ""}`}
    >
      {children}
      <input
        className={`border p-2 rounded font-normal ${
          error ? "border-red-500" : ""
        }`}
        type="text"
        required={required}
        name={name}
        placeholder={placeholder}
        value={textValue}
        onChange={onChangeHandler}
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
