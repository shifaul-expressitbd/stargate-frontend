import React from "react";

export interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  error?: string; // ✅ You already added, good!
}

const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  className = "",
  error,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="inline-flex items-center">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="form-radio text-primary"
        />
        <span
          className={`ml-1 text-sm ${disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-700 dark:text-white"}`}
        >
          {label}
        </span>
      </label>

      {error && (
        <p className="text-red-500 text-xs mt-1 ml-5">{error}</p> // ✅ Show error nicely below with some left margin
      )}
    </div>
  );
};

export default RadioButton;
