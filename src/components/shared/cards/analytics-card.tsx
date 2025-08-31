import { AnimatePresence, motion, type Easing } from 'motion/react'
import React, { useState } from 'react'
import type { IconType } from 'react-icons'

import { PiArrowDownRightLight, PiArrowUpLeftLight } from 'react-icons/pi'

type AnalyticsCardProps = {
  icon: IconType
  value: string | number
  label: string
  trend?: {
    value: string | number
    isPositive: boolean
  }
  className?: string
}

const iconVariants = {
  initial: { rotate: 0 },
  hover: {
    rotate: [0, -5, 5, -5, 5, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'easeInOut' as Easing // Fix: Use const assertion
    }
  },
  animate: { rotate: 0 }
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  icon: Icon,
  value,
  label,
  trend
}) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <AnimatePresence>
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        className={`bg-white dark:bg-slate-700 p-1 md:p-4 rounded-2xl shadow-md overflow-hidden relative h-full`}
      >
        {/* Background Graphics */}
        <div className='absolute inset-0 z-0'>
          {/* Gradient Background */}
          <div className='absolute inset-0 bg-gradient-to-l from-primary/20 to-primary/10'></div>

          {/* New Background Shapes */}
          <motion.div
            className='absolute w-24 h-24 bg-radial-[at_50%_75%] from-primary/75 to-primary/20 to-50% rounded-full -bottom-12 -left-12'
            animate={{ scale: isHovered ? 1.5 : 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          ></motion.div>
          <motion.div
            className='absolute w-16 h-16 bg-accent/30 rounded-full -top-8 -right-8'
            animate={{ scale: isHovered ? 1.5 : 1 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          ></motion.div>
        </div>

        {/* Icon */}
        <div className='absolute inset-y-0 self-center -right-2'>
          <motion.div
            variants={iconVariants}
            initial='initial'
            animate={isHovered ? 'hover' : 'animate'}
            className='bg-orange-100 dark:bg-orange-900/80 rounded-full w-16 h-16 flex items-center justify-center p-2'
          >
            <Icon className='w-full h-full p-2 text-primary dark:text-orange-200' />
          </motion.div>
        </div>

        {/* Content */}
        <div className='h-full flex items-center relative z-10'>
          {/* Value, Label and Trend */}
          <div className='flex flex-col gap-2 place-self-center self-center'>
            <div className='text-gray-500 dark:text-gray-200 text-sm text-nowrap'>
              {label}
            </div>
            <div className='flex items-start gap-2'>
              <div className='text-2xl font-bold text-black dark:text-white'>
                {value}
              </div>
              {trend && (
                <div
                  className={`flex items-center py-1 ${trend.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                  {trend.isPositive ? (
                    <PiArrowUpLeftLight className='w-4 h-4' />
                  ) : (
                    <PiArrowDownRightLight className='w-4 h-4' />
                  )}
                  <span className='text-sm font-medium ml-1'>
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
