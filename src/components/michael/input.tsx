"use client";

import { useState } from "react";

type Props = {
  type?: string;
  placeholder?: string;
  showHide?: boolean; // if true and type is password, show a toggle
  name?: string;
  required?: boolean;
  className?: string;
};

export default function Input({
  type = "text",
  placeholder = "",
  showHide = false,
  name,
  required = true,
  className = "",
}: Props) {
  const [visible, setVisible] = useState(false);

  const inputType = type === "password" && showHide ? (visible ? "text" : "password") : type;

  return (
    <div className="relative">
      <input
        name={name}
        type={inputType}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${className}`}
      />

      {type === "password" && showHide && (
        <button
          type="button"
          aria-label={visible ? "Hide password" : "Show password"}
          onClick={() => setVisible((v) => !v)}
          className="absolute inset-y-0 right-2 flex items-center px-2 text-sm text-gray-600 hover:text-gray-800"
        >
          {visible ? "Hide" : "Show"}
        </button>
      )}
    </div>
  );
}
