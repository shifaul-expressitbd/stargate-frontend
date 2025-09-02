import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
  | 'default'
  | 'ghost'
  | 'flat'
  | 'edge'
  | 'outline'
  | 'outline-flat'
  | 'outline-edge'
  | 'link'
  | 'alien-primary'
  | 'alien-secondary'
  | 'alien-outline'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'
  /**
   * Required for accessibility. Provides a tooltip and accessible name for the button.
   */
  title: string
  type?: 'button' | 'submit' | 'reset'
}

export const Button = ({
  variant = 'default',
  size = 'none',
  children,
  className,
  title,
  type = 'button',
  ...props
}: ButtonProps) => {
  // Base styles for all buttons
  const baseStyles =
    'font-semibold transition-all duration-200 w-fit cursor-pointer disabled:cursor-not-allowed disabled:opacity-60'

  // Variant-specific styles
  const variantStyles = {
    default: 'rounded bg-primary text-gray-900 hover:text-white',
    flat: 'rounded-none bg-primary text-gray-900 hover:text-white',
    edge: 'rounded-full border border-primary',
    outline: 'border border-primary rounded',
    'outline-flat': 'border border-primary rounded-none',
    'outline-edge': 'border border-primary rounded-full',
    ghost: 'shadow-none border-none rounded-none bg-transparent',
    link: 'text-primary hover:underline p-0',
    'alien-primary': 'rounded border border-cyan-400/50 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 backdrop-blur-sm text-cyan-300 hover:text-white hover:border-cyan-300 hover:from-cyan-500/30 hover:to-purple-600/30 transition-all duration-300 font-orbitron text-shadow-cyan-glow hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30',
    'alien-secondary': 'rounded border border-purple-400/50 bg-gradient-to-r from-purple-500/20 to-blue-600/20 backdrop-blur-sm text-purple-300 hover:text-white hover:border-purple-300 hover:from-purple-500/30 hover:to-blue-600/30 transition-all duration-300 font-orbitron text-shadow-purple-strong-glow hover:scale-105 hover:shadow-lg hover:shadow-purple-500/30',
    'alien-outline': 'rounded border-2 border-cyan-400/60 bg-transparent backdp-blur-sm text-cyan-300 hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-purple-600/30 hover:border-cyan-300 transition-all duration-300 font-orbitron text-shadow-cyan-glow hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40',
  }

  // Size-specific styles
  const sizeStyles = {
    none: '',
    xs: 'p-1 text-xs',
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-sm h-10',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  }

  // Check if the button has discernible text
  const hasDiscernibleText =
    React.Children.toArray(children).some(
      (child) => typeof child === 'string' || typeof child === 'number'
    ) || title

  // Throw an error if the button lacks discernible text
  if (!hasDiscernibleText) {
    throw new Error(
      'Button must have discernible text. Provide `children` with text or a `title` for icon-only buttons.'
    )
  }

  return (
    <button
      type={type}
      className={twMerge(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      aria-label={title}
      title={title}
      {...props}
    >
      {children}
    </button>
  )
}
