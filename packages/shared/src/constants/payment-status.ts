export const PaymentStatus = {
  DRAFT: 'DRAFT',
  PENDING_APPROVAL: 'PENDING_APPROVAL',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  REVISION: 'REVISION',
  IN_REGISTRY: 'IN_REGISTRY',
  PAID: 'PAID',
} as const

export type PaymentStatusValue =
  (typeof PaymentStatus)[keyof typeof PaymentStatus]
