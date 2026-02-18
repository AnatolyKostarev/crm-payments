import { Badge } from '@/components/ui/badge'
import type { PaymentStatus } from '../types'

const statusConfig: Record<PaymentStatus, { label: string; variant: string }> =
  {
    DRAFT: { label: 'Черновик', variant: 'bg-gray-100 text-gray-700' },
    PENDING_APPROVAL: {
      label: 'На согласовании',
      variant: 'bg-amber-100 text-amber-700',
    },
    APPROVED: { label: 'Одобрена', variant: 'bg-green-100 text-green-700' },
    REJECTED: { label: 'Отклонена', variant: 'bg-red-100 text-red-700' },
    REVISION: {
      label: 'На доработке',
      variant: 'bg-orange-100 text-orange-700',
    },
    IN_REGISTRY: { label: 'В реестре', variant: 'bg-blue-100 text-blue-700' },
    PAID: { label: 'Оплачена', variant: 'bg-emerald-100 text-emerald-700' },
  }

interface StatusBadgeProps {
  status: PaymentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: '' }

  return (
    <Badge
      variant="outline"
      className={`border-0 font-medium ${config.variant}`}
    >
      {config.label}
    </Badge>
  )
}
