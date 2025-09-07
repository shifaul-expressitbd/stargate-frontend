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
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange'
}

const TabsContext = createContext<TabsContextType | undefined>(undefined)

interface TabsProps {
  defaultValue: string
  children: ReactNode
  className?: string
  onTabChange?: (value: string) => Promise<void> | void
  variant?: 'default' | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange'
}

const Tabs = ({ defaultValue, children, className, onTabChange, variant = 'default' }: TabsProps) => {
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
      value={{ activeTab, setActiveTab, direction, isLoading, variant }}
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
  const { activeTab, variant = 'default' } = context

  const baseClasses = twMerge(
    'inline-flex h-12 items-center justify-start rounded shadow-sm',
    className
  )

  const variantClasses = {
    default: 'bg-white dark:bg-primary-dark border border-gray-200 dark:border-gray-700',
    cosmic: 'bg-transparent text-white backdrop-blur-md border border-cyan-400/50',
    toolbox: 'bg-gray-900/40 backdrop-blur-sm border border-slate-500/30',
    red: 'bg-black/40 backdrop-blur-sm border border-red-500/30',
    green: 'bg-black/40 backdrop-blur-sm border border-green-500/30',
    blue: 'bg-black/40 backdrop-blur-sm border border-blue-500/30',
    sage: 'bg-black/40 backdrop-blur-sm border border-green-600/30',
    orange: 'bg-black/40 backdrop-blur-sm border border-orange-500/30',
  }

  return (
    <div
      role="tablist"
      className={twMerge(baseClasses, variantClasses[variant])}
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
    const { setActiveTab, isLoading, activeTab: currentActiveTab, variant } = context

    const textClasses = (() => {
      if (variant === 'cosmic') {
        return isActive ? 'text-white' : 'text-white hover:text-cyan-200'
      }
      return isActive
        ? 'text-gray-900 dark:text-white'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-200'
    })()

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
          textClasses,
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
            className={twMerge(
              'absolute bottom-0 left-0 right-0 h-0.5',
              (() => {
                const { variant = 'default' } = context
                const indicatorClasses = {
                  default: 'bg-primary dark:bg-secondary',
                  cosmic: 'bg-cyan-400',
                  toolbox: 'bg-slate-400',
                  red: 'bg-red-400',
                  green: 'bg-green-400',
                  blue: 'bg-blue-400',
                  sage: 'bg-green-500',
                  orange: 'bg-orange-400',
                }
                return indicatorClasses[variant]
              })()
            )}
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
            'rounded shadow-sm focus-visible:outline-none focus-visible:ring-2',
            (() => {
              const { variant = 'default' } = context
              const contentClasses = {
                default: 'bg-white dark:bg-black border-gray-200 dark:border-gray-700 focus-visible:ring-primary/50',
                cosmic: 'bg-transparent backdrop-blur-md border-cyan-400/40 focus-visible:ring-cyan-400/70',
                toolbox: 'bg-gray-900/40 backdrop-blur-sm border-slate-500/30 focus-visible:ring-slate-500/50',
                red: 'bg-black/40 backdrop-blur-sm border-red-500/30 focus-visible:ring-red-500/50',
                green: 'bg-black/40 backdrop-blur-sm border-green-500/30 focus-visible:ring-green-500/50',
                blue: 'bg-black/40 backdrop-blur-sm border-blue-500/30 focus-visible:ring-blue-500/50',
                sage: 'bg-black/40 backdrop-blur-sm border-green-600/30 focus-visible:ring-green-600/50',
                orange: 'bg-black/40 backdrop-blur-sm border-orange-500/30 focus-visible:ring-orange-500/50',
              }
              return contentClasses[variant]
            })(),
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

