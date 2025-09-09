import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'cosmic'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl'
}

export const Heading = ({
  as,
  variant = 'h2',
  size,
  className,
  children,
  ...props
}: HeadingProps) => {
  const Tag = as || variant

  const variantStyles = {
    h1: 'text-4xl font-bold tracking-tight lg:text-5xl',
    h2: 'text-3xl font-semibold tracking-tight',
    h3: 'text-2xl font-semibold tracking-tight',
    h4: 'text-xl font-semibold tracking-tight',
    h5: 'text-lg font-semibold',
    h6: 'text-base font-semibold',
    cosmic: 'text-cyan-200 font-bold tracking-tight font-poppins text-shadow-cyan-glow',
  }

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-md',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
  }

  const baseClasses = 'text-foreground'

  return React.createElement(Tag, {
    className: twMerge(
      baseClasses,
      variantStyles[variant],
      size ? sizeStyles[size] : '',
      className
    ),
    ...props
  }, children)
}