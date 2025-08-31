import React from 'react'
import type { IconType } from 'react-icons'
import { twMerge } from 'tailwind-merge'
import { Icon } from '../icons/icon'
import { Button } from './button'

interface ActionItem {
  label: string
  icon: IconType
  onClick: () => void
  className?: string
  iconClass?: string
  tooltip?: string
}

interface ActionBtnProps {
  items: ActionItem[]
  variant?: 'ghost' | 'solid' | 'outline'
  size?: 'xs' | 'sm' | 'md' // Added xs size for more compact option
  direction?: 'horizontal' | 'vertical' // Added direction prop
}

export const ActionBtn: React.FC<ActionBtnProps> = ({
  items,
  variant = 'ghost',
  size = 'md',
  direction = 'horizontal',
}) => {
  // Size classes mapping
  const sizeClasses = {
    xs: {
      // container: 'h-6 w-auto',
      button: 'h-5 w-5',
      icon: 14,
    },
    sm: {
      // container: 'h-7 w-auto',
      button: 'h-6 w-6',
      icon: 16,
    },
    md: {
      // container: 'h-8 w-auto',
      button: 'h-7 w-7',
      icon: 18,
    },
  }

  // Variant classes mapping
  const variantClasses = {
    ghost: 'hover:bg-gray-100/50 dark:hover:bg-gray-700/50',
    solid:
      'bg-gray-100 dark:bg-[#1C1C1D]    hover:bg-gray-200 dark:hover:bg-gray-600',
    outline:
      'border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700',
  }

  // Direction classes
  const directionClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  }

  return (
    <div
      className={twMerge(
        'flex items-center justify-center',
        'rounded-lg transition-all',
        variantClasses[variant],
        directionClasses[direction],
        'overflow-hidden'
      )}
    >
      {items.map((item, index) => (
        <Button
          key={index}
          onClick={() => {
            item.onClick()
          }}
          variant="ghost"
          className={twMerge(
            'flex items-center justify-center',
            'text-gray-700 dark:text-gray-200',
            'transition-colors duration-150',
            'hover:bg-gray-300 dark:hover:bg-gray-200',
            sizeClasses[size].button,
            item.className
          )}
          title={item.label}
          aria-label={item.label}
        >
          <Icon
            icon={item.icon}
            size={sizeClasses[size].icon}
            className={twMerge(
              'text-current',
              'flex-shrink-0',
              item.iconClass
            )}
          />
        </Button>
      ))}
    </div>
  )
}
