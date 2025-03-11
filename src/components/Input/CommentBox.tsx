"use client";

import { useState } from "react";

interface commentBoxProps {
  required?: boolean;
  name?: string;
  error?: string;
  postId: string;
  createComment: (
    comment: string,
    postId: string
  ) => Promise<{ message?: string; success?: string }>;
}

const CommentBox = ({
  required,
  name,
  error,
  postId,
  createComment,
}: commentBoxProps) => {
  const [inputText, setInputText] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await createComment(inputText, postId);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
  };

  return (
    <div className="flex items-center mb-4">
      <textarea
        className={`flex-1 border p-2 rounded font-normal ${
          error ? "border-red-500" : ""
        }`}
        required={required}
        name={name}
        placeholder="Add a comment..."
        onChange={handleChange}
      ></textarea>
      {error && (
        <p className="mb-4 text-red-500" aria-live="polite">
          {error}
        </p>
      )}

      <div className="ml-2">
        <button
          className={` ${
            inputText.trim() ? "text-red-500 disabled" : "text-gray-500"
          }`}
          disabled={!inputText.trim()}
          onClick={handleSubmit}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default CommentBox;
