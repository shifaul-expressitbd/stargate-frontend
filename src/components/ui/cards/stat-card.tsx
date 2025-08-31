import { AnimatePresence, motion } from 'motion/react'
import React, { useState } from 'react'
import type { IconType } from 'react-icons'
import { PiArrowDownRightLight, PiArrowUpLeftLight } from 'react-icons/pi'

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
  className
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <AnimatePresence>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        className={`flex items-center justify-start bg-white dark:bg-slate-700 p-1 md:p-4 rounded-2xl shadow-md overflow-hidden relative ${className}`}
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
            <div className='flex items-center justify-center w-14 h-14 rounded-full p-0.5 border-primary border-2'>
              <motion.div
                variants={iconVariants}
                initial='initial'
                animate={isHovered ? 'hover' : 'animate'}
                className='bg-gray-200 dark:bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center p-0'
              >
                <Icon className='text-primary dark:text-white w-full h-full p-2' />
              </motion.div>
            </div>
            <div className='flex flex-col-reverse md:flex-row items-center justify-start gap-0.5 md:gap-4'>
              <div>
                <div className='text-xl md:text-2xl font-bold text-black dark:text-white'>
                  {value}
                </div>
                <div className='text-gray-500 dark:text-gray-200 text-sm md:text-lg text-nowrap'>
                  {label}
                </div>
              </div>

              {trend && (
                <div
                  className={`flex items-center self-start md:self-end md:place-self-end ${trend.isPositive ? 'text-green-500' : 'text-red-500'
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
