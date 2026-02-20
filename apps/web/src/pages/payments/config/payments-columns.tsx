import type { ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Send, Trash2 } from 'lucide-react'
import { StatusBadge } from '@/entities/payment/ui/StatusBadge'
import type { Payment } from '@/entities/payment/types'
import { ActionsMenu, type ActionItem } from '@/shared/ui/ActionsMenu'

export interface PaymentsColumnsParams {
  formatAmount: (amount: string, currency: string) => string
  onView: (id: string) => void
  onEdit: (id: string) => void
  onSubmit: (id: string) => void
  onDeleteRequest: (id: string) => void
  isSubmitting: boolean
}

export function getPaymentsColumns({
  formatAmount,
  onView,
  onEdit,
  onSubmit,
  onDeleteRequest,
  isSubmitting,
}: PaymentsColumnsParams): ColumnDef<Payment>[] {
  return [
    {
      accessorKey: 'number',
      header: '№',
      cell: ({ row }) => (
        <span className="font-mono text-sm text-muted-foreground">
          #{row.original.number}
        </span>
      ),
    },
    {
      accessorKey: 'purpose',
      header: 'Назначение',
      cell: ({ row }) => (
        <div className="max-w-[300px]">
          <p className="truncate font-medium">{row.original.purpose}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.contractor.name}
          </p>
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Сумма',
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatAmount(row.original.amount, row.original.currency)}
        </span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Статус',
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      accessorKey: 'author',
      header: 'Автор',
      cell: ({ row }) => (
        <span className="text-sm">{row.original.author.name}</span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Дата',
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString('ru-RU'),
    },
    {
      accessorKey: 'dueDate',
      header: 'Срок оплаты',
      cell: ({ row }) => {
        const dueDate = row.original.dueDate
        if (!dueDate) {
          return <span className="text-muted-foreground">—</span>
        }
        return new Date(dueDate).toLocaleDateString('ru-RU')
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const p = row.original
        const actions: ActionItem[] = [
          {
            label: 'Просмотр',
            icon: <Eye className="h-4 w-4" />,
            onClick: () => onView(p.id),
          },
          ...(p.status === 'DRAFT'
            ? [
                {
                  label: 'Изменить',
                  icon: <Pencil className="h-4 w-4" />,
                  onClick: () => onEdit(p.id),
                },
                {
                  label: 'На согласование',
                  icon: <Send className="h-4 w-4" />,
                  onClick: () => onSubmit(p.id),
                  disabled: isSubmitting,
                },
                {
                  label: 'Удалить',
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => onDeleteRequest(p.id),
                  variant: 'destructive',
                  separator: true,
                },
              ]
            : []),
        ]

        return (
          <div className="flex justify-end">
            <ActionsMenu actions={actions} />
          </div>
        )
      },
    },
  ]
}
