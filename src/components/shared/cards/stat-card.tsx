import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import type { IconType } from 'react-icons'
import { PiArrowDownRightLight, PiArrowUpLeftLight } from 'react-icons/pi'

type StatCardVariant = 'default' | 'cosmic'

type StatCardProps = {
  icon: IconType
  value: string | number
  label: string
  trend?: {
    value: string | number
    isPositive: boolean
  }
  progressPercentage?: number
  className?: string
  variant?: StatCardVariant
}

const iconVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'easeInOut' as const
    }
  },
  animate: { rotate: 0 }
}

export const StatCard: React.FC<StatCardProps> = ({
  icon: Icon,
  value,
  label,
  trend,
  className,
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const getVariantClasses = () => {
    switch (variant) {
      case 'cosmic':
        return 'bg-slate-900/80 dark:bg-slate-800/90 border border-cyan-500/30 shadow-xl shadow-cyan-500/20'
      default:
        return 'bg-white dark:bg-slate-700 shadow-md'
    }
  }

  const getIconVariantClasses = () => {
    switch (variant) {
      case 'cosmic':
        return 'bg-cyan-500/20 dark:bg-cyan-500/10'
      default:
        return 'bg-gray-200 dark:bg-primary/10'
    }
  }

  const getBorderVariantClasses = () => {
    switch (variant) {
      case 'cosmic':
        return 'border-cyan-500 dark:border-cyan-400'
      default:
        return 'border-primary'
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        className={`flex items-center justify-start p-1 md:p-4 rounded-2xl overflow-hidden relative ${getVariantClasses()} ${className}`}
      >
        {/* Background Graphics */}
        <div className='absolute inset-0 z-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10'></div>

          <motion.div
            className='absolute w-24 h-24 bg-primary/30 rounded-full -top-12 -left-12'
            animate={{ rotate: isHovered ? 360 : 0 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          ></motion.div>
          <motion.div
            className='absolute w-16 h-16 bg-secondary/30 rounded-full -bottom-8 -right-8'
            animate={{ scale: isHovered ? 1.2 : 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          ></motion.div>
        </div>

        {/* Content */}
        <div className='relative z-10 w-full'>
          <div className='flex flex-row items-center justify-start gap-1 md:gap-2'>
            <div className={`flex items-center justify-center w-14 h-14 rounded-full p-0.5 border-2 ${getBorderVariantClasses()}`}>
              <motion.div
                variants={iconVariants}
                initial='initial'
                animate={isHovered ? 'hover' : 'animate'}
                className={`${getIconVariantClasses()} rounded-full w-12 h-12 flex items-center justify-center p-0`}
              >
                <Icon className='text-primary dark:text-white w-full h-full p-2' />
              </motion.div>
            </div>
            <div className='flex flex-col-reverse md:flex-row items-center justify-start gap-0.5 md:gap-4'>
              <div>
                <div className='text-xl md:text-2xl font-bold text-white dark:text-white'>
                  {value}
                </div>
                <div className='text-gray-700 dark:text-gray-300 text-sm md:text-lg text-nowrap'>
                  {label}
                </div>
              </div>

              {trend && (
                <div
                  className={`flex items-center self-start md:self-end md:place-self-end ${trend.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}
                >
                  {trend.isPositive ? (
                    <PiArrowUpLeftLight className='w-full h-full' />
                  ) : (
                    <PiArrowDownRightLight className='w-full h-full text-xs' />
                  )}
                  <span className='text-xs md:text-sm font-medium'>
                    {trend.isPositive ? '+' : '-'}
                    {trend.value}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
