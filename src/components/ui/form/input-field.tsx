import React, { useLayoutEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { twMerge } from 'tailwind-merge'
import { FormFieldWrapper } from './FormFieldWrapper'

export interface InputFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string
  label?: string
  value?: string | number
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  icon?: IconType
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  labelRightElement?: React.ReactNode
  className?: string
  inputClassName?: string
  preserveErrorSpace?: boolean
  showError?: boolean
  ref?: React.RefObject<HTMLInputElement | null>
  error?: string
  warning?: string
}

export const InputField = ({
  id,
  label,
  value,
  onChange,
  icon,
  leftElement,
  rightElement,
  labelRightElement,
  className,
  inputClassName,
  preserveErrorSpace = true,
  showError = true,
  error,
  warning,
  ...props
}: InputFieldProps) => {
  const leftRef = useRef<HTMLDivElement>(null)
  const [leftWidth, setLeftWidth] = useState(0)

  useLayoutEffect(() => {
    if (leftRef.current) {
      setLeftWidth(leftRef.current.offsetWidth)
    }
  }, [leftElement, icon])

  return (
    <FormFieldWrapper
      id={id}
      label={label}
      error={error}
      warning={warning}
      showError={showError}
      required={props.required}
      labelRightElement={labelRightElement}
      preserveErrorSpace={preserveErrorSpace}
      className={className}
    >
      <div className='relative'>
        {(icon || leftElement) && (
          <div
            ref={leftRef}
            className='absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2'
          >
            {icon && (
              <div
                className={twMerge(
                  error
                    ? 'text-red-500'
                    : typeof value === 'string' && value.length
                      ? 'text-green-500'
                      : 'text-gray-400 dark:text-gray-500'
                )}
              >
                {React.createElement(icon, { className: 'w-4 h-4' })}
              </div>
            )}
            {leftElement && <>{leftElement}</>}
          </div>
        )}
        <input
          id={id}
          value={value ?? ''}
          onChange={onChange}
          className={twMerge(
            'w-full h-10 py-2 px-3 rounded border text-sm',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'bg-white dark:bg-black text-gray-800 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-400',
            'disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:opacity-75 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-500/30'
              : warning
                ? 'border-yellow-500 focus:ring-yellow-200 dark:focus:ring-yellow-500/30'
                : 'border-gray-300 dark:border-gray-600 hover:border-secondary  dark:hover:border-secondary  focus:ring-orange-200 dark:focus:ring-secondary ',
            rightElement ? 'pr-10' : 'pr-3',
            inputClassName
          )}
          style={{
            paddingLeft: leftWidth ? leftWidth + 16 : undefined // 16px = left-3 (0.75rem) gap
          }}
          {...props}
        />
        {rightElement && (
          <div className='absolute right-1 top-1/2 transform -translate-y-1/2'>
            {rightElement}
          </div>
        )}
      </div>
    </FormFieldWrapper>
  )
}
