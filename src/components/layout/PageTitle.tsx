import React from 'react'
import { twMerge } from 'tailwind-merge'

interface PageTitleProps {
  title: string
  className?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
}

const PageTitle = ({
  title,
  className,
  leftElement,
  rightElement,
}: PageTitleProps) => {
  return (
    <div
      className={twMerge(
        'z-50 w-full flex items-center justify-between p-2 sm:px-4 sm:py-3 rounded-md  bg-white dark:bg-[#1C1C1D] border border-gray-200  dark:border-gray-700',
        className
      )}
    >
      <div className="flex items-center gap-2">
        {leftElement}
        <h1
          className="text-lg md:text-lg font-medium text-black dark:text-white text-wrap"
          role="heading"
          aria-level={1}
        >
          {title}
        </h1>
      </div>
      {rightElement && <div className="flex-shrink-0">{rightElement}</div>}
    </div>
  )
}

export default PageTitle
