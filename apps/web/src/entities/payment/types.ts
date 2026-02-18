import type { PaginationParams } from '@/shared/types'

export type PaymentStatus =
  | 'DRAFT'
  | 'PENDING_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'REVISION'
  | 'IN_REGISTRY'
  | 'PAID'

export interface Payment {
  id: string
  number: number
  amount: string
  currency: string
  purpose: string
  dueDate: string | null
  status: PaymentStatus
  authorId: string
  contractorId: string
  contractId: string | null
  tenantId: string
  createdAt: string
  updatedAt: string
  author: { id: string; name: string }
  contractor: { id: string; name: string; inn: string }
  _count?: { attachments: number; approvals: number }
}

export interface Contract {
  id: string
  number: string
  date: string
  endDate: string | null
  contractorId: string
}

export interface Attachment {
  id: string
  fileName: string
  fileKey: string
  fileSize: number
  mimeType: string
  createdAt: string
}

export interface Approval {
  id: string
  stepOrder: number
  decision: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVISION'
  comment: string | null
  decidedAt: string | null
  createdAt: string
  approver: { id: string; name: string }
}

export interface PaymentDetail extends Payment {
  contract: Contract | null
  attachments: Attachment[]
  approvals: Approval[]
}

export interface PaymentDetail extends Payment {
  contract: Contract | null
  attachments: Attachment[]
  approvals: Approval[]
}

export interface CreatePaymentRequest {
  amount: number
  purpose: string
  contractorId: string
  contractId?: string
  currency?: string
  dueDate?: string
}

export type UpdatePaymentRequest = Partial<CreatePaymentRequest>

export interface PaymentQuery extends PaginationParams {
  status?: PaymentStatus
  contractorId?: string
  dateFrom?: string
  dateTo?: string
}
