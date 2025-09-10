import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import { FiX } from 'react-icons/fi'
import { twMerge } from 'tailwind-merge'
import { Button } from '../buttons/button'

type ModalSize =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl'
  | '5xl'
  | '6xl'

type ModalVariant = 'default' | 'cosmic' | 'glass'

interface ModalProps {
  isModalOpen: boolean
  onClose: () => void
  title?: string | React.ReactNode
  children: React.ReactNode
  showHeader?: boolean
  showFooter?: boolean
  onConfirm?: () => void | Promise<void>
  confirmText?: string
  className?: string
  size?: ModalSize
  disableClickOutside?: boolean
  isConfirming?: boolean
  variant?: ModalVariant
  "aria-label"?: string
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '3xl': 'max-w-3xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
  '6xl': 'max-w-6xl',
}
const Modal: React.FC<ModalProps> = ({
  isModalOpen,
  onClose,
  title,
  children,
  showHeader = true,
  showFooter = true,
  onConfirm,
  confirmText = 'Confirm',
  className,
  size = 'md',
  disableClickOutside = false,
  isConfirming = false,
  variant = 'default',
  "aria-label": ariaLabel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null)
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null)

  // Create portal element and add to DOM
  useEffect(() => {
    const element = document.createElement('div')
    element.id = 'modal-portal'
    document.body.appendChild(element)
    setPortalElement(element)

    console.log('Modal debugging:', {
      showHeader,
      hasTitle: !!title,
      hasModalTitleElement: !!document.getElementById('modal-title'),
      ariaLabelledBy: showHeader ? 'modal-title' : undefined,
      isAriaIssueifiable: showHeader === false && !!title // No header but has title = ARIA violation
    })

    return () => {
      document.body.removeChild(element)
    }
  }, [showHeader, title])

  // Focus management
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements?.[0] as HTMLElement
      firstElement?.focus()
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isModalOpen])

  useEffect(() => {
    // Event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isConfirming) onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement

      const clickedInsideDropdown = target.closest('.custom-select-dropdown')

      if (
        !disableClickOutside &&
        !isConfirming &&
        modalRef.current &&
        !modalRef.current.contains(target) &&
        !clickedInsideDropdown
      ) {
        onClose()
      }
    }

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose, disableClickOutside, isModalOpen, isConfirming])

  const handleConfirm = async () => {
    if (!onConfirm) return
    try {
      await onConfirm()
      // onClose()
    } catch (error) {
      // Error handling can be added here if needed
      console.error('Confirmation failed:', error)
    }
  }

  // Prepare classes based on variant
  const overlayClasses = variant === 'glass' ? 'backdrop-blur-md bg-black/40 dark:bg-black/40' : variant === 'cosmic' ? 'bg-slate-900/95 backdrop-blur-sm' : 'bg-black/80 dark:bg-black/60'
  const modalBgClasses = variant === 'cosmic' ? 'bg-slate-800 shadow-2xl ring-1 ring-cyan-500/20 border border-slate-700' : variant === 'glass' ? 'backdrop-blur-xl bg-white/70 dark:bg-primary-dark/70 border border-gray-300/50 dark:border-gray-600/50' : 'bg-white dark:bg-primary-dark'
  const headerClasses = variant === 'cosmic' ? 'bg-slate-700/90 border-b border-indigo-500/30 shadow-lg' : variant === 'glass' ? 'bg-base/60 rounded-t-lg' : 'bg-primary rounded-t-lg'
  const footerClasses = variant === 'cosmic' ? 'bg-slate-700/90 border-t border-indigo-500/30' : variant === 'glass' ? 'bg-base/80 dark:bg-primary-dark/90' : 'bg-gray-50 dark:bg-primary-dark'

  if (!portalElement) return null

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={twMerge("fixed inset-0 z-[9999] flex items-center justify-center p-4", overlayClasses)}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby={showHeader ? "modal-title" : undefined}
            aria-label={!showHeader ? ariaLabel : undefined}
            className={twMerge(
              'relative rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col ' + modalBgClasses,
              sizeClasses[size],
              className
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {showHeader && (
              <div className={twMerge("flex items-center justify-between p-4", headerClasses)}>
                <h2
                  id="modal-title"
                  className={variant === 'cosmic' ? "text-xl font-semibold text-white/90 text-shadow-cyan-glow" : "text-xl font-semibold text-white"}
                >
                  {title}
                </h2>
                <Button
                  title="Close"
                  aria-label="Close modal"
                  onClick={onClose}
                  className={variant === 'cosmic' ? "text-white/90 hover:bg-slate-600/50 hover:text-white" : "text-white hover:bg-primary/80"}
                  disabled={isConfirming}
                >
                  <FiX size={24} />
                </Button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 p-2 overflow-y-auto scrollbar-thin">
              {children}
            </div>

            {/* Footer */}
            {showFooter && (
              <div className={twMerge(
                "flex justify-end gap-3 p-2 rounded-b-lg",
                variant === 'cosmic' ? "text-white/90" : "text-black dark:text-primary",
                footerClasses
              )}>
                <Button
                  title="Cancel"
                  variant="outline"
                  size="md"
                  onClick={onClose}
                  disabled={isConfirming}
                  className={variant === 'cosmic' ? "border-slate-500 text-white/90 hover:bg-slate-600/50" : "dark:bg-black"}
                >
                  Cancel
                </Button>
                {onConfirm && (
                  <Button
                    title="Confirm"
                    size="md"
                    onClick={handleConfirm}
                    disabled={isConfirming}
                    className={variant === 'cosmic' ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/25 shadow-lg" : "bg-primary hover:bg-secondary text-white"}
                  >
                    {isConfirming ? 'Processing...' : confirmText}
                  </Button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalElement
  )
}

export default Modal
