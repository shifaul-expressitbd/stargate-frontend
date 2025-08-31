import React from 'react'
import type { IconType } from 'react-icons'
import { twMerge } from 'tailwind-merge'
import { FormFieldWrapper } from './FormFieldWrapper'

export interface TextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string
  label?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  icon?: IconType
  rightElement?: React.ReactNode
  labelRightElement?: React.ReactNode
  className?: string
  inputClassName?: string
  preserveErrorSpace?: boolean
  error?: string
  warning?: string
  showCharacterCount?: boolean // New prop to toggle character count visibility
  resize?: boolean // New: show/hide resize handle
}

export const TextareaField = React.forwardRef<
  HTMLTextAreaElement,
  TextareaFieldProps
>(
  (
    {
      id,
      label,
      value = '',
      onChange,
      icon,
      rightElement,
      labelRightElement,
      className,
      inputClassName,
      preserveErrorSpace = true,
      error,
      warning,
      showCharacterCount = true,
      minLength,
      maxLength,
      resize = true,
      rows = 2,
      ...props
    },
    ref
  ) => {
    return (
      <FormFieldWrapper
        id={id}
        label={label}
        error={error}
        warning={warning}
        required={props.required}
        labelRightElement={labelRightElement}
        preserveErrorSpace={preserveErrorSpace}
        className={className}
      >
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-3 text-gray-400 dark:text-gray-500">
              {React.createElement(icon, { className: 'w-4 h-4' })}
            </div>
          )}
          <textarea
            id={id}
            value={value}
            onChange={onChange}
            className={twMerge(
              'w-full min-h-[80px] px-3 py-2 rounded border text-sm pb-4',
              'focus:outline-none focus:ring-2 focus:border-transparent',
              'bg-white dark:bg-black text-gray-900 dark:text-gray-100',
              'placeholder-gray-400 dark:placeholder-gray-400',
              'disabled:bg-gray-50 disabled:cursor-not-allowed dark:disabled:bg-gray-800/50 disabled:opacity-75',
              error
                ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-500/30'
                : 'border-gray-300 dark:border-gray-600 hover:border-secondary  dark:hover:border-secondary  focus:ring-orange-200 dark:focus:ring-secondary ',
              icon ? 'pl-10' : 'pl-3',
              rightElement ? 'pr-10' : 'pr-3',
              inputClassName
            )}
            maxLength={maxLength}
            minLength={minLength}
            rows={rows}
            style={{
              resize: resize ? undefined : 'none',
            }}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-3">{rightElement}</div>
          )}
          {(showCharacterCount || maxLength) && (
            <>
              <div className="absolute right-3 bottom-3 flex justify-end mt-1 text-xs text-gray-500 dark:text-gray-400 gap-2">
                <span>Count: {String(value).trim().length}</span>
                <span>{minLength && `Min: ${minLength}`}</span>
                <span>{maxLength && `Max: ${maxLength}`}</span>
              </div>
            </>
          )}

          {/* Character count display */}
        </div>
      </FormFieldWrapper>
    )
  }
)

TextareaField.displayName = 'TextareaField'
