import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  useReactTable,
  getCoreRowModel,
  type ColumnDef,
} from '@tanstack/react-table'
import { Plus, Eye, Trash2, Send, Pencil } from 'lucide-react'
import { toast } from 'sonner'
import {
  usePayments,
  useDeletePayment,
  useSubmitPayment,
} from '@/entities/payment/hooks'
import { StatusBadge } from '@/entities/payment/ui/StatusBadge'
import { DataTable } from '@/shared/ui/DataTable'
import { ActionsMenu, type ActionItem } from '@/shared/ui/ActionsMenu'
import { PaymentFilters } from './PaymentFilters'
import { PaymentEditDialog } from '@/features/manage-payment/PaymentEditDialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import type { Payment, PaymentQuery } from '../../entities/payment/types'

export function PaymentsListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<PaymentQuery>({ offset: 0, limit: 20 })
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)

  const { data, isLoading } = usePayments(filters)
  const deleteMutation = useDeletePayment()
  const submitMutation = useSubmitPayment()

  const items = data?.data?.items ?? []
  const pagination = data?.data?.pagination

  const handleDelete = async () => {
    if (!deletingId) return
    try {
      await deleteMutation.mutateAsync(deletingId)
      toast.success('Заявка удалена')
    } catch {
      toast.error('Ошибка удаления')
    } finally {
      setDeletingId(null)
    }
  }

  const handleSubmit = useCallback(
    async (id: string) => {
      try {
        await submitMutation.mutateAsync(id)
        toast.success('Заявка отправлена на согласование')
      } catch {
        toast.error('Ошибка отправки')
      }
    },
    [submitMutation]
  )

  const formatAmount = useCallback((amount: string, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(Number(amount))
  }, [])

  const columns = useMemo<ColumnDef<Payment>[]>(
    () => [
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
              onClick: () => navigate(`/payments/${p.id}`),
            },
            ...(p.status === 'DRAFT'
              ? [
                  {
                    label: 'Изменить',
                    icon: <Pencil className="h-4 w-4" />,
                    onClick: () => setEditingPaymentId(p.id),
                  },
                  {
                    label: 'На согласование',
                    icon: <Send className="h-4 w-4" />,
                    onClick: () => handleSubmit(p.id),
                    disabled: submitMutation.isPending,
                  },
                  {
                    label: 'Удалить',
                    icon: <Trash2 className="h-4 w-4" />,
                    onClick: () => setDeletingId(p.id),
                    variant: 'destructive' as const,
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
    ],
    [formatAmount, handleSubmit, navigate, submitMutation.isPending]
  )

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Заявки на оплату</h1>
        <Button onClick={() => navigate('/payments/create')}>
          <Plus className="mr-2 h-4 w-4" />
          Создать заявку
        </Button>
      </div>

      <PaymentFilters
        filters={filters}
        onChange={f => setFilters({ ...f, offset: 0 })}
      />

      <DataTable
        table={table}
        columns={columns}
        isLoading={isLoading}
        pagination={pagination}
        onPaginationChange={o => setFilters(prev => ({ ...prev, offset: o }))}
        emptyMessage="Заявки не найдены"
      />

      <AlertDialog
        open={!!deletingId}
        onOpenChange={() => setDeletingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить заявку?</AlertDialogTitle>
            <AlertDialogDescription>
              Черновик заявки и все вложения будут удалены.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <PaymentEditDialog
        open={!!editingPaymentId}
        onOpenChange={(open) => {
          if (!open) {
            setEditingPaymentId(null)
          }
        }}
        paymentId={editingPaymentId}
      />
    </div>
  )
}
