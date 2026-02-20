import type { Approval } from '../types'

export function getApprovalDecisionBadgeVariant(decision: string) {
  switch (decision) {
    case 'APPROVED':
      return 'bg-green-100 text-green-700'
    case 'REJECTED':
      return 'bg-red-100 text-red-700'
    case 'REVISION':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export function getApprovalDecisionLabel(decision: string) {
  switch (decision) {
    case 'APPROVED':
      return 'Одобрено'
    case 'REJECTED':
      return 'Отклонено'
    case 'REVISION':
      return 'На доработку'
    default:
      return 'Ожидает'
  }
}

export function sortApprovalsByStep(approvals: Approval[] = []) {
  return [...approvals].sort((a, b) => a.stepOrder - b.stepOrder)
}
