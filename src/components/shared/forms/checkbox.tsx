import { twMerge } from "tailwind-merge";
import { FormFieldWrapper } from "./FormFieldWrapper";

interface CheckboxProps {
  id: string;
  label?: string | React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

export const Checkbox = ({ id, label, checked, onChange, disabled, error, className }: CheckboxProps) => (
  <FormFieldWrapper id={id} error={error} className={className}>
    <div className='flex items-center'>
      <input
        id={id}
        type='checkbox'
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        aria-label={label ? undefined : `Checkbox for ${id.replace('-', ' ')}`}
        className={twMerge(
          "h-4 w-4 rounded border focus:ring-2 focus:ring-offset-0",
          error
            ? "border-red-500 text-red-600 focus:ring-red-200"
            : "border-gray-300 text-orange-600 focus:ring-orange-200",
          disabled && "cursor-not-allowed opacity-50"
        )}
      />
      {label && (
        <label htmlFor={id} className='ml-2 block text-sm text-gray-700 dark:text-gray-300'>
          {label}
        </label>
      )}
    </div>
  </FormFieldWrapper>
);
