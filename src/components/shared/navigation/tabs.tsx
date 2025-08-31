import { motion } from 'motion/react'
import React, {
  createContext,
  type ReactNode,
  Suspense,
  useCallback,
  useContext,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { LoadingSpinner } from '../feedback/loading-spinner'

interface TabsContextType {
  activeTab: string
  setActiveTab: (value: string, direction?: number) => void
  direction: number
  isLoading: boolean
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
  onTabChange?: (value: string) => Promise<void> | void
}

const Tabs = ({ defaultValue, children, className, onTabChange }: TabsProps) => {
  const [activeTab, setActiveTabState] = useState<string>(defaultValue)
  const [direction, setDirection] = useState<number>(1)
  const [isLoading, setIsLoading] = useState(false)

  const setActiveTab = useCallback(
    async (value: string, newDirection?: number) => {
      if (value === activeTab) return

      const dir = newDirection ?? (value > activeTab ? 1 : -1)
      setDirection(dir)
      setIsLoading(true)

      try {
        if (onTabChange) await onTabChange(value)
      } catch (err) {
        console.error('Tab change error:', err)
      } finally {
        setActiveTabState(value)
        setIsLoading(false)
      }
    },
    [activeTab, onTabChange]
  )

  return (
    <TabsContext.Provider
      value={{ activeTab, setActiveTab, direction, isLoading }}
    >
      <div className={twMerge('flex flex-col w-full gap-2', className)}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

const TabsList = React.memo(({ children, className }: TabsListProps) => {
  const context = useContext(TabsContext)
  if (!context) throw new Error('TabsList must be used within a Tabs component')
  const { activeTab } = context

  return (
    <div
      role="tablist"
      className={twMerge(
        'inline-flex h-12 items-center justify-start rounded bg-white dark:bg-[#1C1C1D]',
        'border border-gray-200 dark:border-gray-700 shadow-sm',
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement<TabsTriggerProps>(child)) {
          return React.cloneElement(child, {
            isActive: child.props.value === activeTab,
          })
        }
        return child
      })}
    </div>
  )
})
TabsList.displayName = 'TabsList'

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
  isActive?: boolean
  disabled?: boolean
}

const TabsTrigger = React.memo(
  ({
    value,
    children,
    className,
    isActive = false,
    disabled = false,
  }: TabsTriggerProps) => {
    const context = useContext(TabsContext)
    if (!context) {
      throw new Error('TabsTrigger must be used within a Tabs component')
    }
    const { setActiveTab, isLoading, activeTab: currentActiveTab } = context

    return (
      <motion.button
        role="tab"
        aria-selected={isActive}
        aria-controls={`tab-content-${value}`}
        disabled={disabled || isLoading}
        onClick={() =>
          setActiveTab(value, value > currentActiveTab ? 1 : -1)
        }
        className={twMerge(
          'relative inline-flex items-center justify-center whitespace-nowrap rounded px-4 py-2 text-sm font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          isActive
            ? 'text-primary dark:text-secondary'
            : 'text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-200',
          className
        )}
        whileHover={
          !disabled && !isLoading
            ? { scale: 1.05, transition: { duration: 0.15, ease: 'easeOut' } }
            : {}
        }
        whileTap={
          !disabled && !isLoading
            ? { scale: 0.98, transition: { duration: 0.1, ease: 'easeIn' } }
            : {}
        }
      >
        {isLoading && isActive ? (
          <span className="flex items-center gap-1">
            <LoadingSpinner />
            {children}
          </span>
        ) : (
          children
        )}
        {isActive && (
          <motion.div
            layoutId="activeTabIndicator"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-secondary"
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
              mass: 0.5,
            }}
          />
        )}
      </motion.button>
    )
  }
)
TabsTrigger.displayName = 'TabsTrigger'

interface TabsContentProps {
  value: string
  children: ReactNode | (() => ReactNode)
  className?: string
  fallback?: ReactNode
}

const TabsContent = React.memo(
  ({
    value,
    children,
    className,
    fallback = (
      <div className="h-48 flex items-center justify-center">Loading...</div>
    ),
  }: TabsContentProps) => {
    const context = useContext(TabsContext)
    if (!context) throw new Error('TabsContent must be used within Tabs')
    const { activeTab } = context

    if (activeTab !== value) return null

    return (
      <div
        role="tabpanel"
        id={`tab-content-${value}`}
        aria-labelledby={`tab-trigger-${value}`}
      >
        <div
          className={twMerge(
            'p-4 rounded bg-white dark:bg-black border border-gray-200 dark:border-gray-700 shadow-sm',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
            className
          )}
        >
          <Suspense fallback={fallback}>
            {typeof children === 'function' ? children() : children}
          </Suspense>
        </div>
      </div>
    )
  }
)
TabsContent.displayName = 'TabsContent'

export { Tabs, TabsContent, TabsList, TabsTrigger }

