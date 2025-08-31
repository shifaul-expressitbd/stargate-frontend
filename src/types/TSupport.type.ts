import type { MetaResponse } from "./TMetaResponse.type";

export interface SupportTicket {
  _id: string;
  ticketId: string;
  owner: {
    _id: string;
    email: string;
    name: string;
  };
  ticketBy: {
    _id: string;
    email: string;
    name: string;
  };
  email?: string;
  phone: string;
  reason: string;
  description: string;
  status: "pending" | "approved" | "resolved" | "rejected";
  screenshot: Array<{
    public_id: string;
    secure_url: string;
    optimizeUrl: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface SupportTicketResponse {
  status: number;
  success: boolean;
  message: string;
  meta: MetaResponse;
  data: SupportTicket[];
}

// import { MetaResponse } from './metaResponse'

// export interface Attachment {
//   id: string
//   name: string // Original filename
//   type: 'image' | 'document' | 'video' | 'other'
//   url: string // Secure access URL
//   thumbnailUrl?: string // For image previews
//   size: number // In bytes
// }

// export interface SupportTicket {
//   id: string // Primary identifier (preferred over _id in frontend)
//   ticketNumber: string // Human-readable unique ID (e.g. "SUPPORT-12345")
//   subject: string // Short description of the issue
//   requester: {
//     // User who submitted the ticket
//     id: string
//     name: string
//     email: string
//     userType: 'customer' | 'agent' | 'admin' // Added role context
//   }
//   assignee?: {
//     // Optional assigned support agent
//     id: string
//     name: string
//     email: string
//     team: string
//   }
//   customer: {
//     // Clearer name than "owner"
//     id: string
//     name: string
//     email: string
//     accountId?: string // Associated business account
//   }
//   priority: 'low' | 'medium' | 'high' | 'critical' // Added priority
//   category: 'billing' | 'technical' | 'account' | 'general' // Better than "reason"
//   description: string
//   status:
//     | 'open'
//     | 'in_progress'
//     | 'escalated'
//     | 'resolved'
//     | 'closed'
//     | 'rejected' // Unified status
//   attachments: Attachment[]
//   source: 'web' | 'email' | 'chat' | 'phone' // How ticket was created
//   relatedTickets?: string[] // For linked issues
//   createdAt: string
//   updatedAt: string
//   closedAt?: string // Track resolution time
//   resolutionNotes?: string // How was issue resolved
//   satisfactionRating?: 1 | 2 | 3 | 4 | 5 // Customer feedback
// }

// export interface PaginatedResponse<T> {
//   status: number
//   success: boolean
//   message: string
//   meta: MetaResponse
//   data: T[]
// }

// export interface SingleResponse<T> {
//   status: number
//   success: boolean
//   message: string
//   data: T
// }

// // Specific response types for SupportTicket
// export type SupportTicketsResponse = PaginatedResponse<SupportTicket>
// export type SupportTicketResponse = SingleResponse<SupportTicket>
