// components/form/FormFieldWrapper.tsx
import React from 'react'
import { twMerge } from 'tailwind-merge'

interface FormFieldWrapperProps {
  id?: string
  label?: string | React.ReactNode
  error?: string
  warning?: string
  helperText?: string
  required?: boolean
  showError?: boolean
  labelRightElement?: React.ReactNode
  preserveErrorSpace?: boolean
  children: React.ReactNode
  className?: string
}

export const FormFieldWrapper = ({
  id,
  label,
  error,
  warning,
  helperText,
  required = false,
  labelRightElement,
  showError = true,
  preserveErrorSpace = true,
  children,
  className
}: FormFieldWrapperProps) => (
  <div className={twMerge('space-y-1.5 w-full', className)} data-required={required}>
    {(label || labelRightElement) && (
      <div className='flex items-center justify-between'>
        {label && (
          <label
            htmlFor={id}
            className={twMerge(
              'block text-sm font-medium',
              error
                ? 'text-red-600 dark:text-accent'
                : 'text-gray-700 dark:text-gray-200'
            )}
          >
            {label}
            {required && <span className='text-accent ml-0.5'>*</span>}
          </label>
        )}
        {labelRightElement && (
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            {labelRightElement}
          </div>
        )}
      </div>
    )}
    {children}
    {helperText && <p className='text-gray-500 text-xs mt-1'>{helperText}</p>}
    {showError &&
      (preserveErrorSpace ? (
        <div className='sm:min-h-5'>
          {error && (
            <p id={id ? `${id}-error` : undefined} className='text-accent text-xs mt-1 capitalize'>{error}</p>
          )}
          {warning && (
            <p id={id ? `${id}-warning` : undefined} className='text-yellow-700 text-xs mt-1 capitalize'>{warning}</p>
          )}
        </div>
      ) : (
        error && <p className='text-accent text-xs mt-1'>{error}</p>
      ))}
  </div>
)
