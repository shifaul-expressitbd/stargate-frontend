import { useEffect, useRef, useState, type FC, type PropsWithChildren } from 'react'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297
const MM_TO_PX = 3.779527559
const A4_WIDTH_PX = A4_WIDTH_MM * MM_TO_PX
const MOBILE_BREAKPOINT = 768

const InvoiceWrapper: FC<PropsWithChildren> = ({ children }) => {
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
        setScale(availableWidth / A4_WIDTH_PX)
      } else {
        // Desktop scaling - normal behavior
        const containerWidth = container.clientWidth
        const scaleX = containerWidth / A4_WIDTH_PX
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
      className="w-full max-w-min mx-auto print:p-0 print:gap-0 sm:gap-2 "
      style={{
        // Let the container height be determined by its children
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {Array.isArray(children) ? (
        children.map((child, idx) => (
          <div
            key={idx}
            style={{
              width: '210mm',
              minHeight: '297mm',
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              backgroundColor: 'white',
              // padding: '12.7mm',
              boxSizing: 'border-box',
              position: 'relative',
              overflow: 'hidden',
              // Mobile-specific styles
              ...(isMobile && {
                margin: 'auto',
                height: `${A4_HEIGHT_MM * MM_TO_PX * scale}px`,
              }),
            }}
            className="invoice-page"
          >
            {child}
          </div>
        ))
      ) : (
        <div
          style={{
            width: '210mm',
            minHeight: '297mm',
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
            backgroundColor: 'white',
            // padding: '12.7mm',
            boxSizing: 'border-box',
            position: 'relative',
            overflow: 'hidden',
            // Mobile-specific styles
            ...(isMobile && {
              margin: 'auto',
              height: `${A4_HEIGHT_MM * MM_TO_PX * scale}px`,
            }),
          }}
          className="invoice-page"
        >
          {children}
        </div>
      )}
    </div>
  )
}

export default InvoiceWrapper
