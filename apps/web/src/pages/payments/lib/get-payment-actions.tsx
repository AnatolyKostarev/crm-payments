import { Eye, Pencil, Send, Trash2 } from 'lucide-react'
import type { Payment } from '@/entities/payment/types'
import type { ActionItem } from '@/shared/ui/ActionsMenu'

interface GetPaymentActionsParams {
  payment: Payment
  onView: (id: string) => void
  onEdit: (id: string) => void
  onSubmit: (id: string) => void
  onDeleteRequest: (id: string) => void
  isSubmitting: boolean
}

export function getPaymentActions({
  payment,
  onView,
  onEdit,
  onSubmit,
  onDeleteRequest,
  isSubmitting,
}: GetPaymentActionsParams): ActionItem[] {
  return [
    {
      label: 'Просмотр',
      icon: <Eye className="h-4 w-4" />,
      onClick: () => onView(payment.id),
    },
    ...(payment.status === 'DRAFT'
      ? [
          {
            label: 'Изменить',
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit(payment.id),
          },
          {
            label: 'На согласование',
            icon: <Send className="h-4 w-4" />,
            onClick: () => onSubmit(payment.id),
            disabled: isSubmitting,
          },
          {
            label: 'Удалить',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => onDeleteRequest(payment.id),
            variant: 'destructive',
            separator: true,
          },
        ]
      : []),
  ]
}
