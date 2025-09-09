// features/support/components/create-support-ticket.tsx
import PageTitle from '@/components/layout/PageTitle'
import BackButton from '@/components/shared/buttons/back-btn'
import { Button } from '@/components/shared/buttons/button'
import { InputField } from '@/components/shared/forms/input-field'
import type { Option } from '@/components/shared/forms/select'
import { TextareaField } from '@/components/shared/forms/textarea-field'
import { useCreateTicketMutation } from '@/lib/features/support/supportTicketApi'
import { Validators } from '@/utils/validationUtils'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaEnvelope, FaPhone, FaQuestionCircle } from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_FILE_COUNT = 5
const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]

const SUPPORT_TYPE_OPTIONS: Option[] = [
  { value: 'general', label: 'General' },
  { value: 'billing', label: 'Billing' },
  { value: 'technical', label: 'Technical' },
]

interface FormData {
  reason: string
  phone: string
  email?: string
  description: string
}

const CreateSupportTicket = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [imageError, setImageError] = useState<string | null>(null)
  const navigate = useNavigate()
  const [createTicket, { isLoading }] = useCreateTicketMutation()
  const [selectedSupportType, setSelectedSupportType] = useState<Option>(
    SUPPORT_TYPE_OPTIONS[0]
  )
  const [formData, setFormData] = useState<FormData>({
    reason: '',
    phone: '',
    description: '',
  })
  const [imageFiles, setImageFiles] = useState<File[]>([])

  const validateFiles = (files: File[]): string | null => {
    if (files.length > MAX_FILE_COUNT) {
      return `You can upload maximum ${MAX_FILE_COUNT} images`
    }
    const unique = new Set()
    for (const file of files) {
      const key = `${file.name}-${file.size}-${file.type}`
      if (unique.has(key)) {
        return 'Duplicate images are not allowed'
      }
      unique.add(key)
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return 'Please upload only image files (JPEG, PNG, GIF, WEBP)'
      }
      if (file.size > MAX_FILE_SIZE) {
        return 'Each file should be less than 5MB'
      }
    }
    return null
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
    setErrors((prev) => ({ ...prev, [id]: '' }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.reason) {
      newErrors.reason = 'Reason is required'
    } else if (formData.reason.length < 10) {
      newErrors.reason = 'Reason should be at least 10 characters'
    }

    const phoneValidation = Validators.phone(formData.phone)
    if (phoneValidation?.error) {
      newErrors.phone = phoneValidation.error
    }

    if (!formData.description) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 20) {
      newErrors.description = 'Description should be at least 20 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setImageError(null)
    if (!validateForm()) return

    if (imageFiles.length > 0) {
      const errorMessage = validateFiles(imageFiles)
      if (errorMessage) {
        setImageError(errorMessage)
        toast.error(errorMessage)
        return
      }
    }

    const toastId = toast.loading('Creating your support ticket...')

    try {
      // Build a plain object with all fields
      const data = {
        ...formData,
        reason: `${selectedSupportType.value.toString().toUpperCase()}: ${formData.reason
          }`,
      }
      // Only add images if present and valid
      const validImages = imageFiles.filter((f) => f instanceof File)
      const payload: { data: typeof data; images?: File[] } = { data }
      if (validImages.length > 0) {
        payload.images = validImages // always an array of File
      }
      // If backend expects single file, send only the first image
      // payload.images = validImages.length > 0 ? [validImages[0]] : undefined

      const response = await createTicket(payload).unwrap()

      toast.success(response?.message || 'Ticket created successfully!', {
        id: toastId,
        duration: 2000,
      })
      setFormData({ reason: '', phone: '', description: '', email: '' })
      setImageFiles([])
      setIsSubmitted(true)
    } catch (error) {
      toast.error('Failed to create support ticket. Please try again.', {
        id: toastId,
        duration: 2000,
      })
      console.error('Error creating support ticket:', error)
    }
  }

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => navigate('/support/tickets'), 2000)
      return () => clearTimeout(timer)
    }
  }, [isSubmitted, navigate])

  return (
    <div className="flex flex-col gap-2 lg:gap-2 p-2 lg:p-0">
      <PageTitle
        title="Create Support Ticket"
        leftElement={
          <BackButton
            variant="ghost"
            className="text-primary dark:text-white"
          />
        }
      />

      <motion.div
        className="grid grid-cols-1 gap-0 lg:gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <form
          className="grid grid-cols-1 gap-0 lg:gap-2"
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Main Form Section */}
          <div className="space-y-4 bg-white dark:text-white dark:bg-primary-dark text-gray-900 p-2 lg:p-5 rounded border border-gray-300 dark:border-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                id="reason"
                type="text"
                label="Reason"
                placeholder="Briefly describe the issue"
                value={formData.reason}
                onChange={handleChange}
                icon={FaQuestionCircle}
                error={errors.reason}
                required
                className="col-span-1 md:col-span-2"
                leftElement={
                  <>
                    <select
                      id="supportType"
                      value={selectedSupportType.value}
                      onChange={(e) => {
                        const selected = SUPPORT_TYPE_OPTIONS.find(
                          (opt) => opt.value === e.target.value
                        )
                        if (selected) setSelectedSupportType(selected)
                      }}
                      className="bg-transparent text-gray-700 dark:text-white outline-none focus:outline-none p-1 m-0"
                      style={{ border: 'none', boxShadow: 'none' }}
                    >
                      {SUPPORT_TYPE_OPTIONS.map((opt) => (
                        <option
                          key={opt.value}
                          value={opt.value}
                          className="text-gray-700 dark:text-white bg-white dark:bg-black"
                        >
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {': '}
                  </>
                }
              />

              <InputField
                id="phone"
                type="tel"
                label="Phone Number"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                icon={FaPhone}
                error={errors.phone}
                required
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={11}
                onKeyDown={(e) => {
                  // Allow: Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X, Ctrl/Cmd+A
                  if (
                    (e.ctrlKey || e.metaKey) &&
                    ['c', 'v', 'x', 'a'].includes(e.key.toLowerCase())
                  ) {
                    return
                  }
                  // Prevent non-numeric key presses
                  if (
                    !/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault()
                  }
                }}
                onPaste={(e) => {
                  const pasteData = e.clipboardData.getData('text')
                  if (!/^\d+$/.test(pasteData)) {
                    e.preventDefault()
                  }
                }}
              />

              <InputField
                id="email"
                type="email"
                label="Email (Optional)"
                placeholder="Enter your email"
                value={formData.email || ''}
                onChange={handleChange}
                icon={FaEnvelope}
                error={errors.email}
              />

              <div className="md:col-span-2">
                <TextareaField
                  id="description"
                  label="Detailed Description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  rows={6}
                  minLength={20}
                />
              </div>
              {/* TODO: Implement ImageUploadSection */}
              <div className="col-span-1 md:col-span-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    setImageFiles(files)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
              {imageError && (
                <div className="text-red-500 text-sm mt-1">{imageError}</div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-6 col-span-full">
            <Button
              title="Cancel"
              variant="outline"
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 text-gray-700 dark:text-white w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              title="Submit Ticket"
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 w-full sm:w-auto"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <ImSpinner10 className="animate-spin h-5 w-5 mr-2" />
                  Submitting...
                </span>
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateSupportTicket
