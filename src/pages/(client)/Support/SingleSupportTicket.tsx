
import PageTitle from '@/components/layout/PageTitle'
import BackButton from '@/components/shared/buttons/back-btn'
import { Button } from '@/components/shared/buttons/button'
import StarRating from '@/components/shared/feedback/star-rating'
import { ImageUploadSection } from '@/components/shared/forms/image-upload-section'
import { TextareaField } from '@/components/shared/forms/textarea-field'
import Modal from '@/components/shared/modals/modal'
import { useReplyToTicketMutation } from '@/lib/features/support/supportTicketApi'
import type { SupportTicket, TicketReply } from '@/types/TSupportTicket.type'
import { formatDateTimeLocal } from '@/utils/dateUtils'
import { useState } from 'react'
import {
  FaChevronLeft,
  FaChevronRight,
  FaReply,
  FaUserCircle,
} from 'react-icons/fa'
import { ImSpinner10 } from 'react-icons/im'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { twMerge } from 'tailwind-merge'

const MOCK_TICKET: SupportTicket = {
  _id: 'mock-12345',
  ticketId: 'SUP-2023-001',
  subject: 'TECHNICAL: Et tempora quibusdam quibusdam',
  description:
    'This is a mock support ticket description showing how the component would look with data. The actual ticket data will appear here when available.',
  priority: 'medium',
  category: 'technical',
  status: 'in_progress',
  requester: {
    _id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '01701005355',
    userType: 'customer',
  },
  customer: {
    _id: 'cust-1',
    name: 'Acme Inc',
    email: 'contact@acme.com',
    accountId: 'acct-123',
  },
  assignee: {
    _id: 'agent-1',
    name: 'Sarah Johnson',
    email: 's.johnson@support.com',
    team: 'Technical Support',
  },
  screenshot: [
    {
      public_id: 'frontend.calquick.app_dashboard (1).png-497930',
      secure_url:
        'https://res.cloudinary.com/dalhtlxyc/image/upload/v1752049769/frontend.calquick.app_dashboard%20%281%29.png-497930.png',
      optimizeUrl:
        'https://res.cloudinary.com/dalhtlxyc/image/upload/f_auto,q_auto/frontend.calquick.app_dashboard%20(1).png-497930?_a=BAMCkGUq0',
    },
    {
      public_id: 'frontend.calquick.app_dashboard (2).png-132133',
      secure_url:
        'https://res.cloudinary.com/dalhtlxyc/image/upload/v1752049770/frontend.calquick.app_dashboard%20%282%29.png-132133.png',
      optimizeUrl:
        'https://res.cloudinary.com/dalhtlxyc/image/upload/f_auto,q_auto/frontend.calquick.app_dashboard%20(2).png-132133?_a=BAMCkGUq0',
    },
  ],
  replies: [
    {
      _id: 'reply-1',
      author: {
        id: 'agent-1',
        name: 'Sarah Johnson',
        email: 's.johnson@support.com',
        role: 'agent',
      },
      message:
        "Thank you for submitting your ticket. I can see you're having issues with the dashboard loading. Could you please:\n1. Clear your browser cache\n2. Try in incognito mode\n3. Let me know if the issue persists",
      isInternalNote: false,
      createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      screenshot: [
        {
          public_id: 'support-agent-screenshot-1',
          secure_url: 'https://example.com/support-screenshot1.jpg',
          optimizeUrl: 'https://example.com/optimized/support-screenshot1.jpg',
        },
      ],
      rating: 4, // Added rating from customer
    },
    {
      _id: 'reply-2',
      author: {
        id: 'customer-1',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'customer',
      },
      message:
        "Thanks for the quick response! I tried both suggestions but the issue persists. Here are some additional screenshots showing the error messages I'm getting.",
      isInternalNote: false,
      createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
      screenshot: [
        {
          public_id: 'customer-error-screenshot-1',
          secure_url: 'https://example.com/error-screenshot1.jpg',
          optimizeUrl: 'https://example.com/optimized/error-screenshot1.jpg',
        },
        {
          public_id: 'customer-error-screenshot-2',
          secure_url: 'https://example.com/error-screenshot2.jpg',
          optimizeUrl: 'https://example.com/optimized/error-screenshot2.jpg',
        },
      ],
    },
    {
      _id: 'reply-3',
      author: {
        id: 'agent-1',
        name: 'Sarah Johnson',
        email: 's.johnson@support.com',
        role: 'agent',
      },
      message:
        "I've identified the issue - it appears to be a bug in our latest release. I've escalated this to our development team and we should have a fix deployed by tomorrow. I'll keep you updated.",
      isInternalNote: false,
      createdAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
      updatedAt: new Date(Date.now() - 21600000).toISOString(),
    },
    {
      _id: 'reply-4',
      author: {
        id: 'system-1',
        name: 'System',
        email: 'system@company.com',
        role: 'system',
      },
      message: 'Ticket automatically closed after 48 hours of inactivity',
      isInternalNote: true,
      createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      updatedAt: new Date(Date.now() - 3600000).toISOString(),
    },
  ],
  reopenRequests: [
    {
      _id: 'reopen-1',
      requestedBy: {
        id: 'customer-1',
        name: 'John Doe',
        email: 'john@example.com',
      },
      reason: 'The issue has reoccurred after the supposed fix',
      status: 'pending',
      createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    },
  ],
  createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
  updatedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
  firstResponseAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
  resolvedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
  closedAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
  lastCustomerReplyAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
  lastAgentReplyAt: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
  source: 'web',
  resolutionType: 'fixed',
  satisfactionRating: 4,
  slaStatus: 'within_sla',
  slaDueAt: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
}

type GalleryContext = {
  type: 'ticket' | 'reply'
  index: number // Index of the current image in its array
  images: Array<{ public_id: string; secure_url: string; optimizeUrl: string }>
  replyId?: string // Only for reply screenshots
}

const SingleSupportTicket = () => {
  const navigate = useNavigate()
  const [ticketState, setTicketState] = useState<SupportTicket>(MOCK_TICKET)
  const ticket = ticketState

  // State for image gallery
  const [galleryContext, setGalleryContext] = useState<GalleryContext | null>(
    null
  )
  const [replyContent, setReplyContent] = useState('')
  const [isReplying, setIsReplying] = useState(false)
  const [isReopeningLoading, setIsReopeningLoading] = useState(false)

  const [showReopenForm, setShowReopenForm] = useState(false)

  const [replyToTicket, { isLoading: isReplyingLoading }] =
    useReplyToTicketMutation()

  const [replyImages, setReplyImages] = useState<File[]>([])
  const [replyImagePreviews, setReplyImagePreviews] = useState<string[]>([])
  const [replyImageError, setReplyImageError] = useState<string | null>(null)

  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const MAX_FILE_COUNT = 5
  const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
  ]

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

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Please enter a reply message')
      return
    }
    setReplyImageError(null)
    if (replyImages.length > 0) {
      const errorMessage = validateFiles(replyImages)
      if (errorMessage) {
        setReplyImageError(errorMessage)
        toast.error(errorMessage)
        return
      }
    }
    try {
      await replyToTicket({
        ticketId: ticket._id,
        message: replyContent,
        isInternalNote: false,
        images: replyImages.length > 0 ? replyImages : undefined,
      }).unwrap()

      toast.success('Reply sent successfully')
      setReplyContent('')
      setReplyImages([])
      setReplyImagePreviews([])
      setIsReplying(false)
    } catch (error) {
      toast.error('Failed to send reply')
      console.error('Error replying to ticket:', error)
    }
  }

  const handleRateResponse = async (
    replyId: string,
    rating: 1 | 2 | 3 | 4 | 5
  ) => {
    try {
      // For mock purposes, update the local state
      const updatedReplies = ticket.replies.map((reply) => {
        if (reply._id === replyId) {
          return { ...reply, rating }
        }
        return reply
      })
      toast.success(`Thank you for your ${rating}-star rating!`)
      // Calculate new average satisfaction rating
      const ratedReplies = updatedReplies.filter((r) => r.rating)
      const newAverage = ratedReplies.length
        ? Math.round(
          ratedReplies.reduce((sum, reply) => sum + (reply.rating || 0), 0) /
          ratedReplies.length
        )
        : 0
      setTicketState({
        ...ticket,
        replies: updatedReplies,
        satisfactionRating: newAverage as 1 | 2 | 3 | 4 | 5,
      })
    } catch (error) {
      toast.error('Failed to submit rating')
      console.error('Error rating reply:', error)
    }
  }

  const openImageGallery = (context: GalleryContext) => {
    setGalleryContext(context)
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    if (!galleryContext) return

    const { images, index } = galleryContext
    const newIndex =
      direction === 'prev'
        ? index === 0
          ? images.length - 1
          : index - 1
        : index === images.length - 1
          ? 0
          : index + 1

    setGalleryContext({
      ...galleryContext,
      index: newIndex,
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`
    return formatDateTimeLocal(dateString)
  }

  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-red-500 dark:text-red-400">
          No ticket data found.
        </span>
        <button
          className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
          onClick={() => navigate(-1)}
        >
          Go Back
        </button>
      </div>
    )
  }

  const canReply = ['open', 'pending', 'in_progress'].includes(ticket.status)
  const canReopen = ['resolved', 'closed'].includes(ticket.status)

  return (
    <div className="space-y-4">
      <PageTitle
        title={`#${ticket.ticketId || ticket._id} - ${ticket.subject.slice(
          0,
          50
        )}`}
        leftElement={
          <BackButton
            variant="ghost"
            className="text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-gray-600"
          />
        }
        rightElement={
          <div className="flex gap-2">
            {canReopen && (
              <Button
                title="Request Reopen Ticket"
                variant="outline"
                size="md"
                className="text-primary dark:text-white hover:bg-primary/10 dark:hover:bg-gray-600"
                onClick={() => {
                  setIsReopeningLoading(true)
                  setShowReopenForm(true)
                  setIsReopeningLoading(false)
                }}
                disabled={isReopeningLoading}
              >
                {isReopeningLoading ? (
                  <ImSpinner10 className="animate-spin mr-2" />
                ) : (
                  'Request Reopen'
                )}
              </Button>
            )}
            {canReply && (
              <Button
                title="Reply to Ticket"
                size="md"
                onClick={() => setIsReplying(true)}
                className="flex gap-2 items-center text-white hover:bg-primary/10 dark:hover:bg-gray-600"
              >
                <FaReply />
                Reply
              </Button>
            )}
          </div>
        }
      />

      {/* Ticket Information */}
      <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-start gap-6 bg-slate-400 rounded-t-lg p-2">
          <div className="flex gap-3">
            <FaUserCircle className="text-2xl text-gray-700 mt-1 w-10" />
            <div className="flex flex-col justify-center">
              <p className="text-gray-900 dark:text-gray-100 font-semibold">
                <span>{ticket.requester?.name || 'N/A'}, </span>
                <span className="font-medium text-xs capitalize">
                  {ticket.requester.userType || 'N/A'}
                </span>
              </p>
              <p className="text-black dark:text-gray-50 text-sm">
                {ticket.requester?.email || 'N/A'} |{' '}
                {ticket.requester?.phone || 'N/A'}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-gray-900 dark:text-gray-100">
              {formatDateTimeLocal(ticket.createdAt)}
            </p>
            <div className={`flex gap-0 text-xs font-semibold`}>
              <span
                className={`p-1 rounded-l uppercase ${ticket.status === 'open'
                  ? 'bg-yellow-100 text-yellow-800'
                  : ticket.status === 'in_progress'
                    ? 'bg-blue-100 text-blue-800'
                    : ticket.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : ticket.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-900 text-gray-100'
                  }`}
              >
                {ticket.status}
              </span>
              <span
                className={`p-1 rounded-r uppercase ${ticket.priority === 'medium'
                  ? 'bg-blue-100 text-blue-900'
                  : ticket.priority === 'high'
                    ? 'bg-red-100 text-red-900'
                    : ticket.priority === 'low'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-900'
                  }`}
              >
                {ticket.priority || 'medium'}
              </span>
            </div>
          </div>
        </div>
        <div className="text-black dark:text-white rounded-b-lg">
          <p className="whitespace-pre-line pl-14 p-2">{ticket.description}</p>

          {/* Ticket Screenshots */}
          {ticket.screenshot && ticket.screenshot.length > 0 && (
            <div className="pl-14 px-2 py-4">
              <div className="flex flex-wrap gap-4">
                {ticket.screenshot.map((img, idx) => (
                  <button
                    key={img?.public_id || idx}
                    onClick={() =>
                      openImageGallery({
                        type: 'ticket',
                        index: idx,
                        images: ticket.screenshot,
                      })
                    }
                    className="w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:text-white"
                  >
                    <img
                      src={img?.optimizeUrl || img?.secure_url}
                      alt={`Screenshot ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Replies Section */}
        {ticket.replies?.length > 0 &&
          ticket.replies.map((reply: TicketReply) => (
            <div
              key={reply._id}
              className={twMerge(
                'p-2',
                reply.isInternalNote
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                  : reply.author.role !== 'customer'
                    ? 'bg-gray-50 dark:bg-primary-dark border-gray-200 dark:border-gray-700'
                    : ''
              )}
            >
              <div className="flex gap-2 w-full">
                <FaUserCircle className=" text-2xl text-gray-400 w-10" />
                <div className="">
                  <div className="flex items-center justify-between mb-1">
                    <div className={'flex items-center gap-2'}>
                      <p className="text-gray-900 dark:text-gray-100 font-semibold">
                        <span>{reply.author?.name || 'N/A'}, </span>
                        <span className="font-medium text-xs capitalize">
                          {reply.author?.role || 'N/A'}
                        </span>
                      </p>
                      {reply.isInternalNote && (
                        <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-100 px-2 py-0.5 rounded">
                          Internal Note
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(reply.createdAt)}
                    </span>
                  </div>
                  <div className="prose dark:prose-invert max-w-none">
                    {reply.message}
                  </div>
                  {reply.screenshot && reply.screenshot.length > 0 && (
                    <div className="flex flex-wrap gap-4 py-4">
                      {reply.screenshot.map((img, idx) => (
                        <button
                          key={img?.public_id || idx}
                          onClick={() =>
                            openImageGallery({
                              type: 'reply',
                              index: idx,
                              images: reply.screenshot || [],
                              replyId: reply._id,
                            })
                          }
                          className="w-32 h-32 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-800 dark:text-white"
                        >
                          <img
                            src={img?.optimizeUrl || img?.secure_url}
                            alt={`Screenshot ${idx + 1}`}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                  {reply.author.role !== 'customer' && (
                    <div className="mt-3">
                      <StarRating
                        initialRating={reply.rating || 0}
                        onRate={(star) =>
                          handleRateResponse(
                            reply._id,
                            star as 1 | 2 | 3 | 4 | 5
                          )
                        }
                        disabled={!!reply.rating}
                        size="md"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Reopen and Reply Form */}
      {(showReopenForm || isReplying) && (
        <div className="bg-white dark:bg-black rounded-lg border border-gray-200 dark:border-gray-700">
          {showReopenForm && (
            <p className="text-center p-2 mb-2 dark:text-white bg-yellow-400 rounded-t-lg">
              This ticket is closed. You may reply to this ticket to reopen it.
            </p>
          )}
          <div className="flex gap-2 w-full p-2">
            <FaUserCircle className="text-2xl text-gray-400 w-10" />
            <div className="flex-1 flex flex-col gap-2 space-y-2">
              <TextareaField
                id="replyContent"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Type your reply here..."
                rows={4}
                preserveErrorSpace={false}
              />
              <div className="flex flex-col md:flex-row justify-between gap-2">
                <div>
                  <ImageUploadSection
                    label="Attach screenshots (optional)"
                    variant="compact"
                    previewImages={replyImagePreviews}
                    setPreviewImages={setReplyImagePreviews}
                    setImageFiles={setReplyImages}
                    multiple
                    maxFiles={MAX_FILE_COUNT}
                    tooltipContent="Upload screenshots of the issue (max 5)"
                  />
                  {replyImageError && (
                    <div className="text-red-500 text-sm mt-1">
                      {replyImageError}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    title="Cancel Reply"
                    size="md"
                    variant="outline"
                    onClick={() => {
                      setShowReopenForm(false)
                      setIsReplying(false)
                      setReplyImages([])
                      setReplyImagePreviews([])
                      setReplyImageError(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    title="Send Reply"
                    size="md"
                    onClick={handleSubmitReply}
                    disabled={isReplyingLoading || !replyContent.trim()}
                  >
                    {isReplyingLoading ? (
                      <ImSpinner10 className="animate-spin mr-2" />
                    ) : (
                      'Send Reply'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image Gallery Modal */}
      <Modal
        isModalOpen={!!galleryContext}
        onClose={() => setGalleryContext(null)}
        title={
          galleryContext
            ? `Screenshot ${galleryContext.index + 1} of ${galleryContext.images.length
            }`
            : ''
        }
        size="6xl"
        showFooter={false}
      >
        {galleryContext && (
          <div className="bg-white dark:bg-black rounded-lg flex flex-col w-full h-full">
            <div className="relative flex-1 flex items-center justify-center p-4">
              <button
                onClick={() => navigateImage('prev')}
                className="absolute -left-5 top-1/2 -translate-y-1/2 dark:text-white bg-gray-100/80 dark:bg-[#1C1C1D]/80 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full h-12 w-12 flex items-center justify-center"
              >
                <FaChevronLeft />
              </button>

              <img
                src={
                  galleryContext.images[galleryContext.index]?.optimizeUrl ||
                  galleryContext.images[galleryContext.index]?.secure_url
                }
                alt={`Screenshot ${galleryContext.index + 1}`}
                className="max-h-[70vh] max-w-full object-contain rounded"
              />

              <button
                onClick={() => navigateImage('next')}
                className="absolute -right-5 top-1/2 -translate-y-1/2 dark:text-white bg-gray-100/80 dark:bg-[#1C1D1D]/80 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full h-12 w-12 flex items-center justify-center"
              >
                <FaChevronRight />
              </button>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {galleryContext.type === 'ticket'
                  ? 'Original ticket screenshot'
                  : `Screenshot from reply by ${ticket.replies?.find(
                    (r) => r._id === galleryContext.replyId
                  )?.author.name || 'agent'
                  }`}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default SingleSupportTicket
