import React from 'react'
import { FiChevronDown } from 'react-icons/fi'
import { twMerge } from 'tailwind-merge'

interface ItemsPerPageSelectorProps {
    value: number
    onChange: (value: number) => void
    className?: string
    disabled?: boolean
    'aria-label'?: string
}

const ITEMS_PER_PAGE_OPTIONS = [10, 20, 50, 100]

export const ItemsPerPageSelector: React.FC<ItemsPerPageSelectorProps> = ({
    value,
    onChange,
    className,
    disabled = false,
    'aria-label': ariaLabel = 'Items per page',
}) => {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    const handleToggle = (e: React.MouseEvent) => {
        if (disabled) return
        if (e) {
            setIsOpen(!isOpen)
        }
    }

    const handleOptionClick = (option: number) => {
        onChange(option)
        setIsOpen(false)
    }

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(e.target as Node)
            ) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger */}
            <div
                onClick={handleToggle}
                role="combobox"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label={ariaLabel}
                tabIndex={disabled ? -1 : 0}
                className={twMerge(
                    'flex items-center h-10 px-2 rounded border cursor-pointer select-none',
                    'bg-white dark:bg-black text-gray-900 dark:text-white border-gray-300 dark:border-gray-600',
                    isOpen && 'ring-2 ring-orange-200 dark:ring-orange-600 focus:ring-2 focus:ring-orange-300',
                    disabled && 'opacity-50 cursor-not-allowed',
                    className
                )}
            >
                <span className="flex-1">{value}</span>
                <FiChevronDown className="ml-1" />
            </div>

            {/* Dropdown */}
            {isOpen && (
                <div
                    className="absolute top-12 left-0 right-0 z-[99999] bg-white dark:bg-black border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-40 overflow-auto"
                    role="listbox"
                    tabIndex={-1}
                >
                    {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                        <div
                            key={option}
                            role="option"
                            aria-selected={value === option}
                            onClick={() => handleOptionClick(option)}
                            className={twMerge(
                                'px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700',
                                value === option
                                    ? 'bg-orange-100 dark:bg-orange-700 text-orange-700 dark:text-white'
                                    : 'text-gray-900 dark:text-white'
                            )}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}