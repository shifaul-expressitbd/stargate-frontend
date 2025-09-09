import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface TextProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  variant?: 'default' | 'subtle' | 'muted' | 'cosmic'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Text = ({
  as = 'span',
  variant = 'default',
  size,
  className,
  children,
  ...props
}: TextProps) => {
  const Tag = as

  const variantStyles = {
    default: 'text-foreground',
    subtle: 'text-muted-foreground',
    muted: 'text-muted-foreground/80',
    cosmic: 'text-cyan-200/80 font-poppins text-shadow-cyan-glow',
  }

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const baseClasses = 'leading-relaxed'

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