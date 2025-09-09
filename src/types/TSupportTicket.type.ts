import type { MetaResponse } from './TMetaResponse.type'

export interface TicketReply {
  _id: string
  author: {
    id: string
    name: string
    email: string
    role: 'customer' | 'agent' | 'admin' | 'system'
  }
  message: string
  screenshot?: Array<{
    public_id: string
    secure_url: string
    optimizeUrl: string
  }>
  isInternalNote: boolean // Visible only to support team
  createdAt: string
  updatedAt: string
  rating?: 1 | 2 | 3 | 4 | 5 // Only present if author is agent, admin, or system and current user is customer
}

export interface ReopenRequest {
  _id: string
  requestedBy: {
    id: string
    name: string
    email: string
  }
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: {
    id: string
    name: string
  }
  reviewedAt?: string
  createdAt: string
}

export interface SupportTicket {
  _id: string // Primary identifier
  ticketId: string // Human-readable ID (e.g. "SUP-2023-12345")
  subject: string // Short description of the issue

  requester: {
    _id: string
    name: string
    email: string
    phone?: string
    userType: 'customer' | 'agent' | 'admin'
  }

  customer: {
    _id: string
    name: string
    email: string
    accountId?: string // Associated business account
  }

  assignee?: {
    _id: string
    name: string
    email: string
    team: string
  }

  priority: 'low' | 'medium' | 'high' | 'critical'
  category:
  | 'billing'
  | 'technical'
  | 'account'
  | 'general'
  | 'feature-request'
  | 'bug'

  description: string
  status:
  | 'new'
  | 'open'
  | 'in_progress'
  | 'waiting_customer'
  | 'waiting_support'
  | 'resolved'
  | 'closed'
  | 'rejected'

  screenshot: Array<{
    public_id: string
    secure_url: string
    optimizeUrl: string
  }>
  replies: TicketReply[]
  reopenRequests: ReopenRequest[]

  source: 'web' | 'email' | 'chat' | 'phone' | 'api'
  relatedTickets?: string[] // For linked issues

  // Dates
  createdAt: string
  updatedAt: string
  firstResponseAt?: string // When agent first replied
  resolvedAt?: string
  closedAt?: string
  lastCustomerReplyAt?: string
  lastAgentReplyAt?: string

  // Resolution tracking
  resolutionNotes?: string
  resolutionType?:
  | 'fixed'
  | 'workaround'
  | 'cannot_reproduce'
  | 'won_t_fix'
  | 'duplicate'
  satisfactionRating?: 1 | 2 | 3 | 4 | 5 // Customer feedback

  // SLA tracking
  slaStatus?: 'within_sla' | 'breached' | 'warning'
  slaDueAt?: string // When response/resolution is due
}

// Response types
export interface PaginatedResponse<T> {
  status: number
  success: boolean
  message: string
  meta: MetaResponse
  data: T[]
}

export interface SingleResponse<T> {
  status: number
  success: boolean
  message: string
  data: T
}

// Specific response types for SupportTicket
export type SupportTicketsResponse = PaginatedResponse<SupportTicket>
export type SupportTicketResponse = SingleResponse<SupportTicket>

// Additional specialized responses
// export interface TicketReplyResponse extends SingleResponse<TicketReply> {}
// export interface ReopenRequestResponse extends SingleResponse<ReopenRequest> {}

// Request types
export interface CreateTicketRequest {
  subject: string
  description: string
  category: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
  attachments?: Array<{
    name: string
    type: string
    url: string
  }>
}

export interface CreateReplyRequest {
  message: string
  isInternalNote?: boolean
  attachments?: Array<{
    name: string
    type: string
    url: string
  }>
}

export interface ReopenTicketRequest {
  reason: string
}
