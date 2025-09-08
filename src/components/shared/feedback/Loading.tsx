import { Skeleton } from '@/components/layout/skeleton'
import useTheme from '@/hooks/useTheme'
import React from 'react'

interface SectionConfig {
  wrapperClass?: string
  gridCols: string
  count: number
  skeletonClass?: string
}

interface LoadingProps {
  headerHeight?: string
  sections: SectionConfig[]
  className?: string
}

/**
 * A universal full-screen loading overlay with fixed positioning.
 */
export const Loading: React.FC<LoadingProps> = ({
  headerHeight = 'h-10 w-full',
  sections,
  className = ''
}) => {
  const { color, mode } = useTheme();

  const getBackgroundStyles = () => {
    if (color === 'cosmic') {
      return 'bg-black/80 backdrop-blur-md';
    }
    return mode === 'dark' ? 'bg-black/50' : 'bg-white/50';
  };

  const content = (
    <div
      className={`space-y-4 p-4 ${className} fixed inset-0 overflow-hidden scrollbar-none ${getBackgroundStyles()}`}
    >
      {headerHeight && <Skeleton className={headerHeight} />}

      {sections.map((sec, idx) => (
        <div key={idx} className={sec.wrapperClass ?? ''}>
          <div className={`grid gap-4 ${sec.gridCols}`}>
            {Array.from({ length: sec.count }).map((_, i) => (
              <Skeleton
                key={i}
                className={sec.skeletonClass ?? 'h-20 w-full'}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  return <div className='relative w-full h-full'>{content}</div>
}

export default Loading
