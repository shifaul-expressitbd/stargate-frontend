import { useEffect, useRef, useState, type FC, type PropsWithChildren } from 'react'

const LABEL_WIDTH_MM = 101.6 // 4 inches in mm
const LABEL_HEIGHT_MM = 152.4 // 6 inches in mm
const MM_TO_PX = 3.779527559
const LABEL_WIDTH_PX = LABEL_WIDTH_MM * MM_TO_PX
const MOBILE_BREAKPOINT = 768

const LabelWrapper: FC<PropsWithChildren> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      const container = containerRef.current
      if (!container) return

      // Check if mobile
      const mobileCheck = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(mobileCheck)

      if (mobileCheck) {
        // Mobile scaling - fit to width with some padding
        const availableWidth = container.clientWidth - 32 // 16px padding on each side
        setScale(availableWidth / LABEL_WIDTH_PX)
      } else {
        // Desktop scaling - normal behavior
        const containerWidth = container.clientWidth
        const scaleX = containerWidth / LABEL_WIDTH_PX
        setScale(Math.min(scaleX, 1)) // Don't scale up beyond 100%
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div
      ref={containerRef}
      className="w-full max-w-min mx-auto print:p-0 print:gap-0 sm:gap-2"
      style={{
        gap: '16px',
      }}
    >
      {Array.isArray(children) ? (
        children.map((child, idx) => (
          <div
            key={idx}
            style={{
              width: `${LABEL_WIDTH_MM}mm`,
              height: `${LABEL_HEIGHT_MM}mm`,
              // transform: `scale(${scale})`,
              transformOrigin: 'top left',
              backgroundColor: 'white',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
              // Mobile-specific styles
              ...(isMobile && {
                margin: 'auto',
                height: `${LABEL_HEIGHT_MM * MM_TO_PX * scale}px`,
              }),
            }}
            className="label-page border border-gray-200 shadow-sm"
          >
            {child}
          </div>
        ))
      ) : (
        <div
          style={{
            width: `${LABEL_WIDTH_MM}mm`,
            height: `${LABEL_HEIGHT_MM}mm`,
            // transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundColor: 'white',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            // Mobile-specific styles
            ...(isMobile && {
              margin: 'auto',
              height: `${LABEL_HEIGHT_MM * MM_TO_PX * scale}px`,
            }),
          }}
          className="label-page border border-gray-200 shadow-sm"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default LabelWrapper