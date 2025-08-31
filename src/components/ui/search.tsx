import React, { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { FaBarcode } from 'react-icons/fa'
import { twMerge } from 'tailwind-merge'
import { Button } from './button'

interface SearchProps {
  onSearch: (searchTerm: string) => void
  placeholder?: string
  className?: string
  value?: string
  inputRef?: React.RefObject<HTMLInputElement | null>
  disabled?: boolean
}

export const Search = ({
  onSearch,
  placeholder,
  value,
  className,
  inputRef,
  disabled,
  ...props
}: SearchProps) => {
  const [searchTerm, setSearchTerm] = useState(value ?? '')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchTerm(value)
    onSearch(value)
  }

  const handleSearchButton = () => {
    onSearch(searchTerm)
  }

  return (
    <div
      className={twMerge(
        'flex w-full relative rounded',
        'focus-within:ring-1 focus-within:ring-orange-200',
        className
      )}
    >
      <FaBarcode className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        // value={value || value === '' ? value : searchTerm}
        value={value !== undefined ? value : searchTerm}
        ref={inputRef}
        onChange={handleSearch}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearchButton()}
        className="w-full pl-10 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-l-md rounded-r-none
                   focus:outline-none focus:border-orange-200
                   text-gray-900 dark:text-white bg-white dark:bg-black
                   placeholder-gray-500 dark:placeholder-gray-400"
        disabled={disabled}
        {...props}
      />

      <Button
        title="Search"
        onClick={handleSearchButton}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`p-2 bg-primary text-white rounded-l-none rounded-r-md hover:bg-orange-600 
                   focus:outline-none border border-l-0 ${
                     isFocused
                       ? 'border-primary dark:border-primary'
                       : 'border-gray-300 dark:border-gray-600'
                   }`}
      >
        <BiSearch className="size-5" />
      </Button>
    </div>
  )
}
