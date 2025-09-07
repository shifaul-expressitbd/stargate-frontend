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
  | 'cosmic-primary'
  | 'cosmic-outline'
  | 'cosmic-ghost'
  | 'toolbox-primary'
  | 'toolbox-outline'
  | 'toolbox-ghost'
  | 'red-primary'
  | 'red-outline'
  | 'red-ghost'
  | 'green-primary'
  | 'green-outline'
  | 'green-ghost'
  | 'blue-primary'
  | 'blue-outline'
  | 'blue-ghost'
  | 'sage-primary'
  | 'sage-outline'
  | 'sage-ghost'
  | 'orange-primary'
  | 'orange-outline'
  | 'orange-ghost'
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
    // Cosmic theme variants (Dark-only optimized)
    'cosmic-primary': 'rounded border border-cyan-400/70 bg-black/40 backdrop-blur-md text-cyan-200 hover:text-white hover:border-cyan-300 hover:bg-black/60 transition-all duration-300 font-orbitron text-shadow-cyan-glow hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/40',
    'cosmic-outline': 'rounded border-2 border-cyan-400/70 bg-transparent text-cyan-200 hover:bg-black/40 hover:border-cyan-300 transition-all duration-300 font-orbitron text-shadow-cyan-glow hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/50',
    'cosmic-ghost': 'rounded bg-transparent text-cyan-200 hover:bg-black/20 transition-all duration-300 font-orbitron text-shadow-cyan-glow hover:scale-105',
    // Toolbox theme variants
    'toolbox-primary': 'rounded border border-slate-500/50 bg-gradient-to-r from-slate-600/20 to-slate-700/20 backdrop-blur-sm text-slate-300 hover:text-white hover:border-slate-400 hover:from-slate-600/30 hover:to-slate-700/30 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-slate-500/30',
    'toolbox-outline': 'rounded border-2 border-slate-500/60 bg-transparent text-slate-300 hover:bg-gradient-to-r hover:from-slate-600/30 hover:to-slate-700/30 hover:border-slate-400 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-slate-500/40',
    'toolbox-ghost': 'rounded bg-transparent text-slate-300 hover:bg-slate-600/20 transition-all duration-300 font-orbitron hover:scale-105',
    // Red theme variants
    'red-primary': 'rounded border border-red-500/50 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-sm text-red-300 hover:text-white hover:border-red-400 hover:from-red-500/30 hover:to-red-600/30 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-red-500/30',
    'red-outline': 'rounded border-2 border-red-500/60 bg-transparent text-red-300 hover:bg-gradient-to-r hover:from-red-500/30 hover:to-red-600/30 hover:border-red-400 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-red-500/40',
    'red-ghost': 'rounded bg-transparent text-red-300 hover:bg-red-500/20 transition-all duration-300 font-orbitron hover:scale-105',
    // Green theme variants
    'green-primary': 'rounded border border-green-500/50 bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm text-green-300 hover:text-white hover:border-green-400 hover:from-green-500/30 hover:to-emerald-600/30 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-green-500/30',
    'green-outline': 'rounded border-2 border-green-500/60 bg-transparent text-green-300 hover:bg-gradient-to-r hover:from-green-500/30 hover:to-emerald-600/30 hover:border-green-400 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-green-500/40',
    'green-ghost': 'rounded bg-transparent text-green-300 hover:bg-green-500/20 transition-all duration-300 font-orbitron hover:scale-105',
    // Blue theme variants
    'blue-primary': 'rounded border border-blue-500/50 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 backdrop-blur-sm text-blue-300 hover:text-white hover:border-blue-400 hover:from-blue-500/30 hover:to-cyan-600/30 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30',
    'blue-outline': 'rounded border-2 border-blue-500/60 bg-transparent text-blue-300 hover:bg-gradient-to-r hover:from-blue-500/30 hover:to-cyan-600/30 hover:border-blue-400 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40',
    'blue-ghost': 'rounded bg-transparent text-blue-300 hover:bg-blue-500/20 transition-all duration-300 font-orbitron hover:scale-105',
    // Sage theme variants
    'sage-primary': 'rounded border border-green-600/50 bg-gradient-to-r from-green-600/20 to-teal-600/20 backdrop-blur-sm text-green-300 hover:text-white hover:border-green-500 hover:from-green-600/30 hover:to-teal-600/30 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-green-600/30',
    'sage-outline': 'rounded border-2 border-green-600/60 bg-transparent text-green-300 hover:bg-gradient-to-r hover:from-green-600/30 hover:to-teal-600/30 hover:border-green-500 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-green-600/40',
    'sage-ghost': 'rounded bg-transparent text-green-300 hover:bg-green-600/20 transition-all duration-300 font-orbitron hover:scale-105',
    // Orange theme variants
    'orange-primary': 'rounded border border-orange-500/50 bg-gradient-to-r from-orange-500/20 to-red-600/20 backdrop-blur-sm text-orange-300 hover:text-white hover:border-orange-400 hover:from-orange-500/30 hover:to-red-600/30 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30',
    'orange-outline': 'rounded border-2 border-orange-500/60 bg-transparent text-orange-300 hover:bg-gradient-to-r hover:from-orange-500/30 hover:to-red-600/30 hover:border-orange-400 transition-all duration-300 font-orbitron hover:scale-105 hover:shadow-lg hover:shadow-orange-500/40',
    'orange-ghost': 'rounded bg-transparent text-orange-300 hover:bg-orange-500/20 transition-all duration-300 font-orbitron hover:scale-105',
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
