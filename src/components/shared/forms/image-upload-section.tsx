// components/ui/image-upload-section.tsx
import { VALID_MIME_TYPES } from '@/types/TFile'
import React, { useRef } from 'react'
import { FaImage, FaTrash } from 'react-icons/fa'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'
import { Button } from '../buttons/button'

const MB_CONVERSION = 1024 * 1024
const MAX_FILE_SIZE = VALID_MIME_TYPES.images.maxSize / MB_CONVERSION

const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
]

interface ImageUploadSectionProps {
    label: string
    // For single image
    previewImage?: string | null
    setPreviewImage?: (value: string | null) => void
    setImageFile?: (file: File | null) => void
    // For multiple images
    previewImages?: string[]
    setPreviewImages?: (value: string[]) => void
    setImageFiles?: (files: File[]) => void
    // Common props
    icon?: React.ReactNode
    tooltipContent?: string
    allowedFileTypes?: string[]
    maxFileSize?: number
    multiple?: boolean
    maxFiles?: number
    className?: string
    variant?: 'default' | 'compact' | 'stacked'
    showAllDelete?: boolean
    showDelete?: boolean
}

export const ImageUploadSection = ({
    label,
    // Single image props
    previewImage,
    setPreviewImage,
    setImageFile,
    // Multiple images props
    previewImages = [],
    setPreviewImages,
    setImageFiles,
    // Common props
    icon = <FaImage className='text-gray-500 dark:text-gray-400' size={20} />,
    allowedFileTypes = ALLOWED_FILE_TYPES,
    maxFileSize = MAX_FILE_SIZE,
    multiple = false,
    maxFiles = 1,
    className,
    variant = 'default',
    showAllDelete = true,
    showDelete = true
}: ImageUploadSectionProps) => {
    // Use a ref for the file input to trigger it programmatically
    const inputRef = useRef<HTMLInputElement>(null)
    const uniqueInputId = React.useId()

    const validateFile = (file: File): string | null => {
        if (!allowedFileTypes.includes(file.type)) {
            return `Invalid file type (${allowedFileTypes.join('/')} only)`
        }
        if (file.size > maxFileSize) {
            return `File size exceeds ${maxFileSize / 1024 / 1024}MB limit`
        }
        return null
    }

    const handleSingleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file || !setPreviewImage || !setImageFile) return

        const error = validateFile(file)
        if (error) {
            toast.error(error)
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setPreviewImage(reader.result as string)
        }
        reader.readAsDataURL(file)
        setImageFile(file)
    }

    const handleMultipleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const files = Array.from(e.target.files || [])
        if (!files.length || !setPreviewImages || !setImageFiles) return

        // Validate each file
        for (const file of files) {
            const error = validateFile(file)
            if (error) {
                toast.error(error)
                return
            }
        }

        // Check total files count
        if (previewImages.length + files.length > maxFiles) {
            toast.error(`You can upload maximum ${maxFiles} images`)
            return
        }

        const newPreviewImages = [...previewImages]
        const newImageFiles: File[] = []

        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                newPreviewImages.push(reader.result as string)
                if (newPreviewImages.length === previewImages.length + files.length) {
                    setPreviewImages(newPreviewImages)
                }
            }
            reader.readAsDataURL(file)
            newImageFiles.push(file)
        })

        setImageFiles([...newImageFiles])
    }

    const removeSingleImage = () => {
        if (setPreviewImage) setPreviewImage(null)
        if (setImageFile) setImageFile(null)
    }

    const removeImageAtIndex = (index: number) => {
        if (!setPreviewImages || !setImageFiles) return

        const newPreviewImages = [...previewImages]
        newPreviewImages.splice(index, 1)
        setPreviewImages(newPreviewImages)

        // Note: You might need to maintain a separate state for files if you need to track them
        // This is a simplified version - you may need to adjust based on your needs
    }

    const handleImageChange = multiple
        ? handleMultipleImageChange
        : handleSingleImageChange

    return (
        <div
            className={twMerge(
                'flex flex-col items-center justify-center',
                variant === 'default' &&
                'border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#1C1C1D]    place-self-center space-y-1.5 p-4 lg:p-5',
                variant === 'compact' && 'h-10',
                variant === 'stacked' && 'flex-col',
                className
            )}
        >
            {variant === 'default' && (
                <div className='flex items-center justify-between w-full'>
                    <label
                        className='block text-sm font-medium text-gray-700 dark:text-gray-300'
                        htmlFor={uniqueInputId}
                    >
                        {label}
                    </label>
                    {((!multiple && previewImage) ||
                        (multiple && previewImages.length > 0)) &&
                        showAllDelete && (
                            <Button
                                title='Remove Images'
                                variant='ghost'
                                size='sm'
                                className='text-red-500 hover:text-red-600'
                                onClick={
                                    multiple ? () => setPreviewImages?.([]) : removeSingleImage
                                }
                            >
                                <FaTrash />
                            </Button>
                        )}
                </div>
            )}

            <div className='w-full h-full'>
                {multiple ? (
                    <div className='w-full rounded overflow-hidden'>
                        <div
                            className={twMerge(
                                'w-full h-full ',
                                variant === 'default' && 'grid grid-cols-5 gap-2',
                                variant === 'compact' && 'flex gap-2',
                                variant === 'stacked' && 'flex flex-col gap-2'
                            )}
                        >
                            {previewImages.length < maxFiles && (
                                <button
                                    type='button'
                                    className={twMerge(
                                        'border-2 border-dashed hover:border-primary dark:hover:border-primary border-gray-300 dark:border-gray-600 rounded flex items-center justify-center bg-gray-50 dark:bg-black focus:outline-none focus:ring-0',
                                        previewImages.length === 0 && 'col-span-5',
                                        previewImages.length > 0 && 'col-span-1',
                                        variant === 'default' && 'w-full h-full',
                                        variant === 'compact' && 'flex h-full',
                                        variant === 'stacked' && 'w-full h-16'
                                    )}
                                    tabIndex={0}
                                    aria-label={`Add image for ${label}`}
                                    onClick={() => inputRef.current?.click()}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            inputRef.current?.click()
                                        }
                                    }}
                                >
                                    <div
                                        className={twMerge(
                                            variant === 'default' &&
                                            'flex flex-col items-center justify-center gap-2 p-4',
                                            variant === 'compact' &&
                                            'flex items-center justify-center gap-2 p-2',
                                            variant === 'stacked' && 'w-full h-16'
                                        )}
                                    >
                                        <div
                                            className={twMerge(
                                                'bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center',
                                                variant === 'default' && 'h-8 w-8',
                                                variant === 'compact' && 'h-4 w-4'
                                            )}
                                        >
                                            {icon}
                                        </div>
                                        <span className='text-xs text-gray-500 dark:text-gray-400 text-center'>
                                            Add more ({maxFiles - previewImages.length} remaining)
                                        </span>
                                    </div>
                                </button>
                            )}
                            {previewImages.map((img, index) => (
                                <div
                                    key={index}
                                    className={twMerge(
                                        'relative group',
                                        variant === 'default' && 'w-full h-full',
                                        variant === 'compact' && 'min-w-auto max-w-20 h-10',
                                        variant === 'stacked' && 'w-full h-10'
                                    )}
                                >
                                    {img.startsWith('blob') ||
                                        (img.startsWith('data:image') && showDelete && (
                                            <button
                                                type='button'
                                                className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none focus:ring-0'
                                                onClick={e => {
                                                    e.stopPropagation()
                                                    removeImageAtIndex(index)
                                                }}
                                                aria-label={`Remove image ${index + 1}`}
                                            >
                                                <FaTrash size={12} />
                                            </button>
                                        ))}
                                    {img.startsWith('blob') || img.startsWith('data:image') ? (
                                        <img
                                            src={img}
                                            alt={`Preview ${index + 1}`}
                                            className={twMerge(
                                                'w-full h-full object-cover rounded border border-gray-200 dark:border-gray-600 aspect-square'
                                            )}
                                        />
                                    ) : (
                                        <img
                                            src={img}
                                            alt={`Preview ${index + 1}`}
                                            className={twMerge(
                                                'w-full h-full object-cover rounded border border-gray-200 dark:border-gray-600 aspect-square'
                                            )}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <input
                            id={uniqueInputId}
                            ref={inputRef}
                            type='file'
                            className='sr-only '
                            onChange={handleImageChange}
                            aria-label={`Upload ${label.toLowerCase()}`}
                            accept={allowedFileTypes.join(',')}
                            multiple={multiple}
                            tabIndex={-1}
                        />
                    </div>
                ) : (
                    <div className='w-full h-full rounded overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 relative dark:bg-black bg-white hover:border-primary dark:hover:border-primary duration-500 ease-in-out'>
                        {previewImage ? (
                            <>
                                <img
                                    src={previewImage}
                                    alt='Preview'
                                    className='w-full h-full object-cover aspect-square'
                                />
                                <button
                                    type='button'
                                    className='absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-0'
                                    tabIndex={0}
                                    role='button'
                                    aria-label='Change image'
                                    onClick={() => inputRef.current?.click()}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            e.preventDefault()
                                            inputRef.current?.click()
                                        }
                                    }}
                                >
                                    <span className='text-white text-sm'>Change Image</span>
                                </button>
                            </>
                        ) : (
                            <button
                                type='button'
                                className='w-full h-full flex flex-col items-center justify-center gap-2 p-4 focus:outline-none focus:ring-0'
                                tabIndex={0}
                                aria-label={`Upload ${label.toLowerCase()}`}
                                onClick={() => inputRef.current?.click()}
                                onKeyDown={e => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault()
                                        inputRef.current?.click()
                                    }
                                }}
                            >
                                <div className='w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center'>
                                    {icon}
                                </div>
                                <span className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                                    Upload image
                                </span>
                                <span className='text-xs text-gray-400 dark:text-gray-500 text-center'>
                                    (Max {maxFileSize / 1024 / 1024}MB,{' '}
                                    {allowedFileTypes.join(', ')})
                                </span>
                            </button>
                        )}
                        <input
                            id={uniqueInputId}
                            ref={inputRef}
                            type='file'
                            className='sr-only'
                            onChange={handleImageChange}
                            aria-label={`Upload ${label.toLowerCase()}`}
                            accept={allowedFileTypes.join(',')}
                            multiple={multiple}
                            tabIndex={-1}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}
