import { Badge } from '@/components/ui/badge'
import type { PaymentStatus } from '../types'
import { PAYMENT_STATUS_META } from '../lib/status-meta'

interface StatusBadgeProps {
  status: PaymentStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = PAYMENT_STATUS_META[status] || { label: status, variant: '' }

  return (
    <Badge
      variant="outline"
      className={`border-0 font-medium ${config.variant}`}
    >
      {config.label}
    </Badge>
  )
}
