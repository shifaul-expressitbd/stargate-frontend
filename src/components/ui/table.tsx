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
import { Skeleton } from './skeleton';

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
      variant === 'default' &&
      'border border-gray-200 dark:border-gray-700',
      showBorder && variant === 'print' && 'border border-gray-400',
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
              'relative rounded bg-white overflow-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400',
              variant !== 'print' &&
              'dark:bg-black dark:scrollbar-track-gray-800 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500',
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
              ? 'bg-gray-50 text-gray-800 dark:bg-primary-dark  dark:text-white border-b border-gray-200 dark:border-gray-600'
              : variant === 'compact'
                ? 'bg-gray-50 text-gray-800 dark:bg-primary-dark  dark:text-white py-1'
                : 'bg-gray-50 text-gray-800 dark:bg-primary-dark  dark:text-white',
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
          sortable
            ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600'
            : '',
          variant === 'bordered' &&
          'border-b border-gray-200 dark:border-gray-600',
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
                : 'text-gray-700 dark:text-gray-100',
          striped && variant === 'print'
            ? 'even:bg-gray-100'
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
          'hover:bg-gray-50 dark:hover:bg-primary-dark ',
          variant === 'print'
            ? 'border-b border-gray-400'
            : variant === 'bordered'
              ? 'border-b border-gray-200 dark:border-gray-600'
              : variant === 'compact'
                ? '[&_td]:py-1'
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
              ? 'bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-primary-dark '
              : variant === 'compact'
                ? 'bg-gray-50 dark:bg-primary-dark  [&_td]:py-1'
                : 'bg-gray-50 border-t border-gray-200 dark:border-gray-600 dark:bg-primary-dark ',
          className
        )}
      >
        {children}
      </tfoot>
    )
  }
)
