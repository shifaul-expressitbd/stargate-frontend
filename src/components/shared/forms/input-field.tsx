import React, { useLayoutEffect, useRef, useState } from 'react'
import type { IconType } from 'react-icons'
import { twMerge } from 'tailwind-merge'
import { FormFieldWrapper } from './FormFieldWrapper'

export type InputFieldVariant = 'default' | 'cosmic'

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
  variant?: InputFieldVariant
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
  variant = 'default',
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
                    ? variant === 'cosmic' ? 'text-red-400 dark:text-red-300' : 'text-accent'
                    : typeof value === 'string' && value.length
                      ? variant === 'cosmic' ? 'text-cyan-400 dark:text-cyan-300' : 'text-green-500'
                      : variant === 'cosmic' ? 'text-cyan-500/70 dark:text-cyan-600/70' : 'text-gray-400 dark:text-gray-500'
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
            variant === 'cosmic'
              ? 'bg-gray-900/80 border-cyan-400/50 text-cyan-100 placeholder-cyan-300/50'
              + ' hover:border-cyan-300 dark:hover:border-cyan-200'
              + ' focus:ring-cyan-200/50 dark:focus:ring-cyan-300/30'
              + ' dark:bg-slate-900 dark:border-cyan-500/50 dark:placeholder-cyan-400/70'
              : 'bg-white dark:bg-black text-gray-800 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-400',
            'disabled:bg-gray-50 dark:disabled:bg-gray-800/50 disabled:opacity-75 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-200 dark:focus:ring-red-500/30'
              : warning
                ? 'border-yellow-500 focus:ring-yellow-200 dark:focus:ring-yellow-500/30'
                : variant === 'cosmic'
                  ? ''
                  : 'border-gray-300 dark:border-gray-600 hover:border-secondary dark:hover:border-secondary focus:ring-orange-200 dark:focus:ring-secondary',
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
