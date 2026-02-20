import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { StatusBadge } from '@/entities/payment/ui/StatusBadge'
import type { Payment } from '@/entities/payment/types'
import { ActionsMenu } from '@/shared/ui/ActionsMenu'
import { getPaymentActions } from '../lib/get-payment-actions'

interface PaymentCardProps {
  payment: Payment
  formatAmount: (amount: string, currency: string) => string
  onView: (id: string) => void
  onEdit: (id: string) => void
  onSubmit: (id: string) => void
  onDeleteRequest: (id: string) => void
  isSubmitting: boolean
}

export function PaymentCard({
  payment,
  formatAmount,
  onView,
  onEdit,
  onSubmit,
  onDeleteRequest,
  isSubmitting,
}: PaymentCardProps) {
  const actions = getPaymentActions({
    payment,
    onView,
    onEdit,
    onSubmit,
    onDeleteRequest,
    isSubmitting,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 gap-3 pb-2">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">#{payment.number}</p>
          <p className="truncate font-semibold leading-tight">
            {payment.contractor.name}
          </p>
        </div>
        <ActionsMenu actions={actions} />
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Назначение</span>
          <span className="max-w-[65%] truncate text-right font-medium">
            {payment.purpose}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Сумма</span>
          <span className="tabular-nums font-medium">
            {formatAmount(payment.amount, payment.currency)}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Статус</span>
          <StatusBadge status={payment.status} />
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Дата</span>
          <span>{new Date(payment.createdAt).toLocaleDateString('ru-RU')}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Срок оплаты</span>
          <span>
            {payment.dueDate
              ? new Date(payment.dueDate).toLocaleDateString('ru-RU')
              : '—'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
