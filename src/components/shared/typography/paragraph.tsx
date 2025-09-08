import React from 'react'
import { twMerge } from 'tailwind-merge'

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: 'default' | 'subtle' | 'muted' | 'cosmic'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

export const Paragraph = ({
  variant = 'default',
  size,
  className,
  children,
  ...props
}: ParagraphProps) => {
  const variantStyles = {
    default: 'text-foreground',
    subtle: 'text-muted-foreground',
    muted: 'text-muted-foreground/80',
    cosmic: 'text-cyan-200/90 font-orbitron text-shadow-cyan-glow',
  }

  const sizeStyles = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }

  const baseClasses = 'leading-7'

  return (
    <p
      className={twMerge(
        baseClasses,
        variantStyles[variant],
        size ? sizeStyles[size] : '',
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}