import React from "react";
import { twMerge } from "tailwind-merge";

export interface RadioButtonProps {
  id: string;
  name: string;
  value: string;
  label: string | React.ReactNode;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  error?: boolean;
}

export const RadioButton = React.forwardRef<HTMLInputElement, RadioButtonProps>(
  (
    {
      id,
      name,
      value,
      label,
      checked = false,
      onChange,
      disabled = false,
      className = "",
      inputClassName = "",
      labelClassName = "",
      error = false,
    },
    ref
  ) => {
    return (
      <label
        htmlFor={id}
        className={twMerge(
          "group relative flex items-center gap-3 cursor-pointer",
          disabled && "cursor-not-allowed opacity-70",
          className
        )}
      >
        <input
          ref={ref}
          type="radio"
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={twMerge(
            "absolute opacity-0 w-0 h-0",
            inputClassName
          )}
          aria-invalid={error}
          aria-disabled={disabled}
        />
        {/* Custom radio button */}
        <div className={twMerge(
          "flex items-center justify-center flex-shrink-0",
          "w-5 h-5 rounded-full border-2 transition-all",
          error
            ? "border-red-500 group-hover:border-red-600"
            : "border-gray-300 group-hover:border-gray-400",
          checked && error ? "border-red-600" : "",
          checked && !error ? "border-orange-600" : "",
          disabled && "border-gray-200 group-hover:border-gray-200",
          "focus-within:ring-2 focus-within:ring-offset-2",
          error ? "focus-within:ring-red-500" : "focus-within:ring-orange-500"
        )}>
          {/* Radio button inner circle */}
          {checked && (
            <div className={twMerge(
              "w-2.5 h-2.5 rounded-full",
              error ? "bg-red-600" : "bg-orange-600",
              disabled && "bg-gray-400"
            )} />
          )}
        </div>

        <span
          className={twMerge(
            "text-base font-normal",
            disabled ? "text-gray-400" : "text-gray-800",
            error && !disabled && "text-red-600",
            labelClassName
          )}
        >
          {label}
        </span>
      </label>
    );
  }
);

RadioButton.displayName = "RadioButton";