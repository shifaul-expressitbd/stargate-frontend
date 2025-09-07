import { Skeleton } from '@/components/layout/skeleton';
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { twMerge } from 'tailwind-merge';

// -------------------- Types --------------------
type SortConfigType = { key: string; direction: 'ascending' | 'descending' }

// -------------------- Context --------------------
interface TableContextProps {
  striped?: boolean
  hoverable?: boolean
  size?: 'sm' | 'md' | 'lg'
  sortConfig?: SortConfigType[]
  onSort?: (key: string) => void
  variant?: 'default' | 'print' | 'bordered' | 'compact'
  | 'cosmic' | 'toolbox' | 'red' | 'green' | 'blue' | 'sage' | 'orange'
  draggableX?: boolean
}

const TableContext = React.createContext<TableContextProps>({})

// -------------------- Table Component --------------------
interface TableProps
  extends React.HTMLAttributes<HTMLTableElement>,
  TableContextProps {
  loading?: boolean
  height?: string | number
  emptyState?: React.ReactNode
  footer?: React.ReactNode
  label?: string
  showBorder?: boolean
  minWidth?: string | number
  skeletonRows?: number
  skeletonColumns?: number
  multiSortEnabled?: boolean
  onMouseDown?: (event: React.MouseEvent<HTMLElement>) => void
}

// Memoized context provider to prevent unnecessary re-renders
const MemoizedTableContextProvider = memo(
  ({
    value,
    children
  }: {
    value: TableContextProps
    children: React.ReactNode
  }) => <TableContext.Provider value={value}>{children}</TableContext.Provider>
)

export const Table = memo(
  ({
    striped = false,
    hoverable = true,
    className,
    children,
    size = 'md',
    onSort,
    loading = false,
    height = 'auto',
    footer,
    label,
    variant = 'default',
    showBorder = true,
    minWidth = '640px',
    skeletonRows = 10,
    skeletonColumns = 10,
    emptyState = 'No data available.',
    multiSortEnabled = false,
    draggableX = true,
    ...props
  }: TableProps) => {
    const [sortConfig, setSortConfig] = useState<SortConfigType[]>([])
    const scrollContainerRef = useRef<HTMLDivElement | null>(null)
    const isDraggingRef = useRef(false)
    const startXRef = useRef(0)
    const scrollLeftRef = useRef(0)

    // Optimized drag functionality with useRef to avoid re-renders
    useEffect(() => {
      if (!draggableX || !scrollContainerRef.current) return

      const container = scrollContainerRef.current

      const handleMouseDown = (e: MouseEvent) => {
        isDraggingRef.current = true
        container.style.cursor = 'grabbing'
        container.style.userSelect = 'none'
        startXRef.current = e.pageX - container.offsetLeft
        scrollLeftRef.current = container.scrollLeft
      }

      const handleMouseMove = (e: MouseEvent) => {
        if (!isDraggingRef.current) return
        e.preventDefault()
        const x = e.pageX - container.offsetLeft
        const walk = (x - startXRef.current) * 1.5
        container.scrollLeft = scrollLeftRef.current - walk
      }

      const handleMouseUp = () => {
        isDraggingRef.current = false
        container.style.cursor = 'grab'
        container.style.removeProperty('user-select')
      }

      // Use passive event listeners where possible for better performance
      container.addEventListener('mousedown', handleMouseDown, {
        passive: true
      })
      container.addEventListener('mousemove', handleMouseMove, {
        passive: false
      })
      container.addEventListener('mouseup', handleMouseUp, { passive: true })
      container.addEventListener('mouseleave', handleMouseUp, { passive: true })

      return () => {
        container.removeEventListener('mousedown', handleMouseDown)
        container.removeEventListener('mousemove', handleMouseMove)
        container.removeEventListener('mouseup', handleMouseUp)
        container.removeEventListener('mouseleave', handleMouseUp)
      }
    }, [draggableX])

    // Memoized sort handler to prevent unnecessary recreations
    const handleSort = useCallback(
      (key: string) => {
        setSortConfig(prevConfig => {
          let direction: 'ascending' | 'descending' = 'ascending'
          const existingConfig = prevConfig.find(config => config.key === key)

          if (existingConfig) {
            direction =
              existingConfig.direction === 'ascending'
                ? 'descending'
                : 'ascending'

            if (multiSortEnabled) {
              return prevConfig.map(config =>
                config.key === key ? { ...config, direction } : config
              )
            } else {
              return [{ key, direction }]
            }
          } else {
            const newConfig = { key, direction }
            return multiSortEnabled ? [...prevConfig, newConfig] : [newConfig]
          }
        })

        onSort?.(key)
      },
      [multiSortEnabled, onSort]
    )

    // Memoized context value to prevent unnecessary re-renders
    const contextValue = useMemo(
      () => ({
        striped,
        hoverable,
        size,
        sortConfig,
        onSort: handleSort,
        draggableX,
        variant
      }),
      [striped, hoverable, size, sortConfig, handleSort, draggableX, variant]
    )

    const baseClasses = twMerge(
      'w-full',
      showBorder &&
      (variant === 'default' || variant === 'cosmic' || variant === 'toolbox' || variant === 'red' || variant === 'green' || variant === 'blue' || variant === 'sage' || variant === 'orange') &&
      (variant === 'default' ? 'border border-gray-200 dark:border-gray-700' :
        variant === 'cosmic' ? 'border border-cyan-400/60' :
          variant === 'toolbox' ? 'border border-slate-500/30' :
            variant === 'red' ? 'border border-red-500/30' :
              variant === 'green' ? 'border border-green-600/30' :
                variant === 'blue' ? 'border border-blue-600/30' :
                  variant === 'sage' ? 'border border-green-600/30' :
                    variant === 'orange' ? 'border border-orange-500/30' :
                      ''),
      showBorder && variant === 'print' && 'border border-gray-400',
      showBorder && variant === 'cosmic' && 'border border-cyan-400/60',
      showBorder && variant === 'toolbox' && 'border border-slate-500/30',
      showBorder && variant === 'red' && 'border border-red-500/30',
      showBorder && variant === 'green' && 'border border-green-600/30',
      showBorder && variant === 'blue' && 'border border-blue-600/30',
      showBorder && variant === 'sage' && 'border border-green-600/30',
      showBorder && variant === 'orange' && 'border border-orange-500/30',
      variant === 'bordered' && 'border-separate border-spacing-0',
      variant === 'compact' && '[&_td]:py-1 [&_th]:py-1',
      className
    )

    const isEmpty = !loading && React.Children.count(children) === 0

    // Memoized skeleton cell to prevent unnecessary recreations
    const renderSkeletonCell = useCallback(
      (index: number) => (
        <TableCell key={index} loading>
          <Skeleton className='h-6 w-full rounded' />
        </TableCell>
      ),
      []
    )

    // Memoized skeleton rows to prevent unnecessary recreations
    const skeletonRowsMemo = useMemo(() => {
      return Array.from({ length: skeletonRows }).map((_, idx) => (
        <TableRow key={idx}>
          {Array.from({ length: skeletonColumns }).map((__, cellIdx) =>
            renderSkeletonCell(cellIdx)
          )}
        </TableRow>
      ))
    }, [skeletonRows, skeletonColumns, renderSkeletonCell])

    return (
      <MemoizedTableContextProvider value={contextValue}>
        <div
          className={twMerge(
            'flex flex-col gap-2',
            variant === 'print' && 'print:gap-1'
          )}
        >
          {label && <TableLabel>{label}</TableLabel>}
          <div
            ref={scrollContainerRef}
            className={twMerge(
              'relative rounded overflow-auto scrollbar-thin',
              variant === 'default' && 'bg-white dark:bg-black',
              variant === 'print' && 'bg-white',
              variant === 'cosmic' && 'bg-gradient-to-br from-black/95 to-black/80 backdrop-blur-md shadow-lg shadow-cyan-500/30',
              variant === 'toolbox' && 'bg-gray-900/80 backdrop-blur-md',
              variant === 'red' && 'bg-black/80 backdrop-blur-md',
              variant === 'green' && 'bg-black/80 backdrop-blur-md',
              variant === 'blue' && 'bg-black/80 backdrop-blur-md',
              variant === 'sage' && 'bg-black/80 backdrop-blur-md',
              variant === 'orange' && 'bg-black/80 backdrop-blur-md',
              variant === 'toolbox' && 'bg-gray-900/80 backdrop-blur-md',
              variant === 'red' && 'bg-black/80 backdrop-blur-md',
              variant === 'green' && 'bg-black/80 backdrop-blur-md',
              variant === 'blue' && 'bg-black/80 backdrop-blur-md',
              variant === 'sage' && 'bg-black/80 backdrop-blur-md',
              variant === 'orange' && 'bg-black/80 backdrop-blur-md',
              // Scrollbar styles
              variant !== 'print' && variant === 'default' && 'scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400 dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500',
              variant !== 'print' && variant === 'cosmic' && 'scrollbar-track-cyan-900/20 scrollbar-thumb-cyan-500/40 hover:scrollbar-thumb-cyan-400/60',
              variant !== 'print' && (variant === 'toolbox' || variant === 'red' || variant === 'green' || variant === 'blue' || variant === 'sage' || variant === 'orange') && 'scrollbar-track-cyan-900/20 scrollbar-thumb-cyan-500/40 hover:scrollbar-thumb-cyan-400/60',
              draggableX && 'cursor-grab'
            )}
            style={{ height }}
          >
            <table className={baseClasses} style={{ minWidth }} {...props}>
              {loading ? (
                <TableBody>{skeletonRowsMemo}</TableBody>
              ) : isEmpty ? (
                <TableBody>
                  <TableRow>
                    <TableCell colSpan={skeletonColumns} align='left'>
                      {emptyState}
                    </TableCell>
                  </TableRow>
                </TableBody>
              ) : (
                children
              )}
              {footer && <TableFooter>{footer}</TableFooter>}
            </table>
          </div>
        </div>
      </MemoizedTableContextProvider>
    )
  }
)

// -------------------- Table Subcomponents --------------------

// Memoized subcomponents to prevent unnecessary re-renders
export const TableLabel = memo(
  ({ className, children }: React.HTMLAttributes<HTMLDivElement>) => {
    const { variant } = useContext(TableContext)
    return (
      <div
        className={twMerge(
          'font-semibold',
          variant === 'print'
            ? 'text-black'
            : 'text-gray-700 dark:text-gray-300',
          className
        )}
      >
        {children}
      </div>
    )
  }
)

export const TableCaption = memo(
  ({ className, children }: React.HTMLAttributes<HTMLTableCaptionElement>) => (
    <caption
      className={twMerge(
        'text-gray-500 dark:text-gray-400 caption-bottom mt-2 print:text-gray-600',
        className
      )}
    >
      {children}
    </caption>
  )
)

export const TableHeader = memo(
  ({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    const { variant } = useContext(TableContext)
    return (
      <thead
        className={twMerge(
          'sticky top-0 text-left font-semibold',
          variant === 'print'
            ? 'bg-white text-black border-b border-gray-400'
            : variant === 'bordered'
              ? 'bg-gray-50 text-gray-800 dark:bg-primary-dark dark:text-white border-b border-gray-200 dark:border-gray-600'
              : variant === 'compact'
                ? 'bg-gray-50 text-gray-800 dark:bg-primary-dark dark:text-white py-1'
                : variant === 'default'
                  ? 'bg-gray-50 text-gray-800 dark:bg-primary-dark dark:text-white'
                  : variant === 'cosmic'
                    ? 'bg-black/60 text-cyan-200 border-b border-cyan-400/60 backdrop-blur-md'
                    : variant === 'toolbox'
                      ? 'bg-black/60 text-slate-200 border-b border-slate-500/60 backdrop-blur-md'
                      : variant === 'red'
                        ? 'bg-black/60 text-red-200 border-b border-red-500/60 backdrop-blur-md'
                        : variant === 'green'
                          ? 'bg-black/60 text-green-200 border-b border-green-500/60 backdrop-blur-md'
                          : variant === 'blue'
                            ? 'bg-black/60 text-blue-200 border-b border-blue-500/60 backdrop-blur-md'
                            : variant === 'sage'
                              ? 'bg-black/60 text-green-200 border-b border-green-600/60 backdrop-blur-md'
                              : variant === 'orange'
                                ? 'bg-black/60 text-orange-200 border-b border-orange-500/60 backdrop-blur-md'
                                : 'bg-gray-50 text-gray-800 dark:bg-primary-dark dark:text-white',
          className
        )}
      >
        {children}
      </thead>
    )
  }
)

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean
  sortKey?: string
  align?: 'left' | 'center' | 'right'
}

export const TableHead = memo(
  ({
    className,
    children,
    sortable = false,
    sortKey,
    align = 'left',
    ...props
  }: TableHeadProps) => {
    const { sortConfig, onSort, variant } = useContext(TableContext)

    const handleSort = useCallback(() => {
      if (sortable && sortKey && onSort) onSort(sortKey)
    }, [sortable, sortKey, onSort])

    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }

    const currentSort = sortConfig?.find(config => config.key === sortKey)

    return (
      <th
        className={twMerge(
          'px-2 py-4 font-medium select-none text-nowrap min-w-fit max-w-min mx-0',
          sortable &&
          (
            variant === 'default'
              ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
              : variant === 'cosmic'
                ? 'cursor-pointer hover:bg-cyan-900/20 hover:shadow-md hover:shadow-cyan-500/20'
                : (variant === 'toolbox' || variant === 'red' || variant === 'green' || variant === 'blue' || variant === 'sage' || variant === 'orange')
                  ? 'cursor-pointer hover:bg-cyan-900/20'
                  : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
          ),
          variant === 'bordered'
            ? 'border-b border-gray-200 dark:border-gray-600'
            : variant === 'cosmic'
              ? 'border-b border-cyan-400/20'
              : variant === 'default' ? 'border-b border-gray-200 dark:border-gray-600' : '',
          alignmentClasses[align],
          className
        )}
        onClick={handleSort}
        {...props}
      >
        <div
          className={`flex items-center ${align === 'center'
            ? 'justify-center'
            : align === 'right'
              ? 'justify-end'
              : ''
            }`}
        >
          <span className='cursor-text select-text'>{children}</span>
          {sortable && currentSort && (
            <span className='ml-1 '>
              {currentSort.direction === 'ascending' ? '↑' : '↓'}
            </span>
          )}
        </div>
      </th>
    )
  }
)

export const TableBody = memo(
  ({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    const { striped, variant } = useContext(TableContext)
    return (
      <tbody
        className={twMerge(
          'font-medium',
          variant === 'print'
            ? 'text-black divide-y divide-gray-400'
            : variant === 'bordered'
              ? 'text-gray-700 dark:text-gray-100 divide-y divide-gray-200 dark:divide-gray-600'
              : variant === 'compact'
                ? 'text-gray-700 dark:text-gray-100 [&_td]:py-1'
                : variant === 'default'
                  ? 'text-gray-700 dark:text-gray-100'
                  : variant === 'cosmic'
                    ? 'text-cyan-100 divide-y divide-cyan-400/20'
                    : variant === 'toolbox'
                      ? 'text-slate-100 divide-y divide-slate-500/20'
                      : variant === 'red'
                        ? 'text-red-100 divide-y divide-red-500/20'
                        : variant === 'green'
                          ? 'text-green-100 divide-y divide-green-500/20'
                          : variant === 'blue'
                            ? 'text-blue-100 divide-y divide-blue-500/20'
                            : variant === 'sage'
                              ? 'text-green-100 divide-y divide-green-600/20'
                              : variant === 'orange'
                                ? 'text-orange-100 divide-y divide-orange-500/20'
                                : 'text-gray-700 dark:text-gray-100',
          striped && variant === 'print'
            ? 'even:bg-gray-100'
            : striped && variant === 'default'
              ? 'even:bg-gray-50 dark:even:bg-gray-700/50'
              : variant === 'cosmic'
                ? striped && 'even:bg-cyan-900/10'
                : (variant === 'toolbox' || variant === 'red' || variant === 'green' || variant === 'blue' || variant === 'sage' || variant === 'orange')
                  ? striped && 'even:bg-cyan-900/10'
                  : striped && 'even:bg-gray-50 dark:even:bg-gray-700/50',
          className
        )}
      >
        {children}
      </tbody>
    )
  }
)

export const TableRow = memo(
  ({
    className,
    children,
    ...props
  }: React.HTMLAttributes<HTMLTableRowElement>) => {
    const { hoverable, variant } = useContext(TableContext)
    return (
      <tr
        className={twMerge(
          'relative',
          variant !== 'print' &&
          hoverable &&
          (
            variant === 'default'
              ? 'hover:bg-gray-50 dark:hover:bg-primary-dark'
              : variant === 'cosmic'
                ? 'hover:bg-cyan-900/20 hover:shadow-md hover:shadow-cyan-500/20'
                : (variant === 'toolbox' || variant === 'red' || variant === 'green' || variant === 'blue' || variant === 'sage' || variant === 'orange')
                  ? 'hover:bg-cyan-900/20'
                  : 'hover:bg-gray-50 dark:hover:bg-primary-dark'
          ),
          variant === 'print'
            ? 'border-b border-gray-400'
            : variant === 'bordered'
              ? 'border-b border-gray-200 dark:border-gray-600'
              : variant === 'compact'
                ? '[&_td]:py-1'
                : variant === 'default'
                  ? 'border-b border-gray-200 dark:border-gray-600'
                  : variant === 'cosmic'
                    ? 'border-b border-cyan-400/20'
                    : (variant === 'toolbox' || variant === 'red' || variant === 'green' || variant === 'blue' || variant === 'sage' || variant === 'orange')
                      ? 'border-b border-cyan-400/20'
                      : 'border-b border-gray-200 dark:border-gray-600',
          className
        )}
        {...props}
      >
        {children}
      </tr>
    )
  }
)

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  loading?: boolean
  loadingFallback?: React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export const TableCell = memo(
  ({
    className,
    children,
    loading = false,
    loadingFallback = <Skeleton className='h-6 w-full' />,
    align = 'left',
    ...props
  }: TableCellProps) => {
    const { variant, size } = useContext(TableContext)

    const alignmentClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right'
    }

    const paddingClasses = {
      sm: variant === 'compact' ? 'px-1 py-0.5' : (variant === 'print' ? 'p-1' : 'px-1 py-1'),
      md: variant === 'compact' ? 'px-2 py-1' : (variant === 'print' ? 'p-1' : 'px-2 py-1.5'),
      lg: variant === 'compact' ? 'px-3 py-1.5' : (variant === 'print' ? 'p-1' : 'px-3 py-2')
    }

    return (
      <td
        className={twMerge(
          'relative truncate text-ellipsis break-all mx-0',
          variant === 'print'
            ? 'border-b border-gray-400'
            : variant === 'bordered'
              ? 'border-b border-gray-200 dark:border-gray-600'
              : variant === 'compact'
                ? 'py-1'
                : variant === 'default'
                  ? 'border-b border-gray-200 dark:border-gray-600'
                  : variant === 'cosmic'
                    ? 'border-b border-cyan-400/20'
                    : (variant === 'toolbox' || variant === 'red' || variant === 'green' || variant === 'blue' || variant === 'sage' || variant === 'orange')
                      ? 'border-b border-cyan-400/20'
                      : 'border-b border-gray-200 dark:border-gray-600',
          alignmentClasses[align],
          paddingClasses[size || 'md'],
          align === 'center'
            ? 'justify-center'
            : align === 'right'
              ? 'justify-end'
              : '',
          className
        )}
        {...props}
      >
        {loading ? (
          loadingFallback
        ) : (
          <div
            className={`cursor-text select-text`}
            onClick={e => {
              e.stopPropagation()
            }}
            onMouseDown={e => {
              e.stopPropagation()
            }}
          >
            {children}
          </div>
        )}
      </td>
    )
  }
)

export const TableFooter = memo(
  ({ className, children }: React.HTMLAttributes<HTMLTableSectionElement>) => {
    const { variant } = useContext(TableContext)
    return (
      <tfoot
        className={twMerge(
          'sticky bottom-0',
          variant === 'print'
            ? 'bg-white border-t border-gray-400'
            : variant === 'bordered'
              ? 'bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-primary-dark'
              : variant === 'compact'
                ? 'bg-gray-50 dark:bg-primary-dark [&_td]:py-1'
                : variant === 'default'
                  ? 'bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-primary-dark'
                  : variant === 'cosmic'
                    ? 'bg-gradient-to-t from-cyan-500/10 to-black/20 border-t border-cyan-400/40 backdrop-blur-sm'
                    : variant === 'toolbox'
                      ? 'bg-slate-600/10 border-t border-slate-500/30 backdrop-blur-sm'
                      : variant === 'red'
                        ? 'bg-red-500/10 border-t border-red-500/30 backdrop-blur-sm'
                        : variant === 'green'
                          ? 'bg-green-500/10 border-t border-green-500/30 backdrop-blur-sm'
                          : variant === 'blue'
                            ? 'bg-blue-500/10 border-t border-blue-500/30 backdrop-blur-sm'
                            : variant === 'sage'
                              ? 'bg-green-600/10 border-t border-green-600/30 backdrop-blur-sm'
                              : variant === 'orange'
                                ? 'bg-orange-500/10 border-t border-orange-500/30 backdrop-blur-sm'
                                : 'bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-primary-dark',
          className
        )}
      >
        {children}
      </tfoot>
    )
  }
)
