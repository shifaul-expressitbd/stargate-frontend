import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface ToggleSwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  checked: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  labelPosition?: 'left' | 'right'
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  id,
  label,
  checked,
  onChange,
  className,
  labelPosition = 'right',
  disabled,
  ...props
}) => {
  // Handle click on the toggle area
  const handleToggleClick = () => {
    if (disabled) return
    onChange({
      target: { checked: !checked, id },
    } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <div
      className={twMerge(
        'flex items-center space-x-2',
        labelPosition === 'left' && 'flex-row-reverse space-x-reverse'
      )}
    >
      {/* Hidden checkbox input */}
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        disabled={disabled}
        {...props}
      />

      {/* Toggle switch */}
      <button
        type="button"
        onClick={handleToggleClick}
        className={twMerge(
          'relative inline-flex items-center h-3.5 w-7 rounded-full transition-colors duration-200 ease-in-out ',
          checked
            ? 'border border-primary dark:border-secondary '
            : 'border  border-gray-400 dark:border-white dark:bg-black',
          disabled ? 'opacity-50 cursor-not-allowed' : 'focus:outline-none',
          className
        )}
        aria-pressed={checked}
        disabled={disabled}
      >
        <span
          className={twMerge(
            'inline-block w-2.5 h-2.5 transform rounded-full shadow transition-transform duration-200 ease-in-out',
            checked
              ? 'translate-x-[15px] bg-primary dark:bg-secondary  '
              : 'translate-x-[1px] dark:bg-white bg-gray-400 '
          )}
        />
      </button>

      {/* Label */}
      {label && (
        <label
          htmlFor={id}
          className={twMerge(
            'text-sm  font-medium text-gray-600 dark:text-white  select-none',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          )}
        >
          {label}
        </label>
      )}
    </div>
  )
}
