import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  usePayments,
  useDeletePayment,
  useSubmitPayment,
} from '@/entities/payment/hooks'
import { DataTable } from '@/shared/ui/DataTable'
import { usePersistedColumnSizing } from '@/shared/hooks/use-persisted-column-sizing'
import { PaymentFilters } from './ui/PaymentFilters'
import { PaymentDateFilterDialog } from './ui/PaymentDateFilterDialog'
import { PaymentContractorFilterDialog } from './ui/PaymentContractorFilterDialog'
import { PaymentEditDialog } from '@/features/manage-payment/PaymentEditDialog'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import type { PaymentQuery } from '../../entities/payment/types'
import { getPaymentsColumns } from './config/payments-columns'

const PAYMENTS_COLUMN_SIZING_STORAGE_KEY = 'table-column-sizing:payments'
const MIN_COLUMN_SIZE = 96

export function PaymentsListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<PaymentQuery>({ offset: 0, limit: 20 })
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
  const { columnSizing, setColumnSizing } = usePersistedColumnSizing(
    PAYMENTS_COLUMN_SIZING_STORAGE_KEY
  )

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

  const handleDateApply = useCallback((dateFrom?: string, dateTo?: string) => {
    setFilters(prev => ({
      ...prev,
      dateFrom,
      dateTo,
      offset: 0,
    }))
  }, [])

  const handleContractorApply = useCallback((contractorIds?: string[]) => {
    setFilters(prev => ({
      ...prev,
      contractorIds,
      contractorId: undefined,
      offset: 0,
    }))
  }, [])

  const columns = useMemo(
    () =>
      getPaymentsColumns({
        formatAmount,
        contractorHeader: () => (
          <div className="flex items-center gap-1">
            <span>Контрагент</span>
            <PaymentContractorFilterDialog
              contractorIds={filters.contractorIds}
              onApply={handleContractorApply}
            />
          </div>
        ),
        createdAtHeader: (
          () => (
            <div className="flex items-center gap-1">
              <span>Дата</span>
              <PaymentDateFilterDialog
                dateFrom={filters.dateFrom}
                dateTo={filters.dateTo}
                onApply={handleDateApply}
              />
            </div>
          )
        ),
        onView: id => navigate(`/payments/${id}`),
        onEdit: setEditingPaymentId,
        onSubmit: handleSubmit,
        onDeleteRequest: setDeletingId,
        isSubmitting: submitMutation.isPending,
      }),
    [
      filters.dateFrom,
      filters.dateTo,
      filters.contractorIds,
      formatAmount,
      handleContractorApply,
      handleDateApply,
      handleSubmit,
      navigate,
      submitMutation.isPending,
    ]
  )

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: MIN_COLUMN_SIZE,
    },
    state: { columnSizing },
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange',
    enableColumnResizing: true,
  })

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <h2 className="shrink-0 text-2xl font-bold tracking-tight">
        Заявки на оплату
      </h2>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <PaymentFilters
          filters={filters}
          onChange={f => setFilters({ ...f, offset: 0 })}
        />
        <Button
          className="h-10"
          onClick={() => navigate('/payments/create')}
        >
          <Plus className="mr-2 h-4 w-4" />
          Создать заявку
        </Button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <DataTable
          table={table}
          columns={columns}
          isLoading={isLoading}
          pagination={pagination}
          onPaginationChange={o => setFilters(prev => ({ ...prev, offset: o }))}
          emptyMessage="Заявки не найдены"
        />
      </div>

      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={open => {
          if (!open) setDeletingId(null)
        }}
        title="Удалить заявку?"
        description="Черновик заявки и все вложения будут удалены."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="destructive"
        onConfirm={handleDelete}
      />

      <PaymentEditDialog
        open={!!editingPaymentId}
        onOpenChange={open => {
          if (!open) {
            setEditingPaymentId(null)
          }
        }}
        paymentId={editingPaymentId}
      />
    </div>
  )
}
