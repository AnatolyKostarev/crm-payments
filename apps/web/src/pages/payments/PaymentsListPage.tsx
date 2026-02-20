import { useState, useMemo, useCallback } from 'react'
import { useNavigate } from 'react-router'
import {
  useReactTable,
  getCoreRowModel,
  type VisibilityState,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  usePayments,
  useDeletePayment,
  useSubmitPayment,
} from '@/entities/payment/hooks'
import { DataTable } from '@/shared/ui/DataTable'
import { TablePagination } from '@/shared/ui/table-pagination'
import { usePersistedColumnSizing } from '@/shared/hooks/use-persisted-column-sizing'
import { usePersistedColumnPreferences } from '@/shared/hooks/use-persisted-column-preferences'
import { useIsLg } from '@/shared/hooks/use-mobile'
import { ColumnSettingsDialog } from '@/shared/ui/ColumnSettingsDialog'
import { PageLoadingState, PageNotFoundState } from '@/shared/ui/page-state'
import { PaymentFilters } from './ui/PaymentFilters'
import { PaymentDateFilterDialog } from './ui/PaymentDateFilterDialog'
import { PaymentContractorFilterDialog } from './ui/PaymentContractorFilterDialog'
import { PaymentCard } from './ui/PaymentCard'
import { PaymentEditDialog } from '@/features/manage-payment/PaymentEditDialog'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import type { PaymentQuery } from '../../entities/payment/types'
import { getPaymentsColumns } from './config/payments-columns'
import {
  PAYMENTS_COLUMN_SIZING_STORAGE_KEY,
  PAYMENTS_COLUMN_PREFERENCES_STORAGE_KEY,
  PAYMENTS_MIN_COLUMN_SIZE,
  PAYMENTS_CONFIGURABLE_COLUMNS,
  PAYMENTS_CONFIGURABLE_COLUMN_IDS,
} from './config/column-settings'

export function PaymentsListPage() {
  const navigate = useNavigate()
  const isLg = useIsLg()
  const [filters, setFilters] = useState<PaymentQuery>({ offset: 0, limit: 20 })
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null)
  const { columnSizing, setColumnSizing } = usePersistedColumnSizing(
    PAYMENTS_COLUMN_SIZING_STORAGE_KEY
  )
  const {
    columnOrder,
    setColumnOrder,
    columnVisibility,
    setColumnVisibility,
    defaultColumnOrder,
    defaultColumnVisibility,
  } = usePersistedColumnPreferences({
    storageKey: PAYMENTS_COLUMN_PREFERENCES_STORAGE_KEY,
    columnIds: PAYMENTS_CONFIGURABLE_COLUMN_IDS,
  })

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

  const handleColumnSettingsApply = useCallback(
    (next: { columnOrder: string[]; columnVisibility: VisibilityState }) => {
      setColumnOrder(next.columnOrder)
      setColumnVisibility(next.columnVisibility)
    },
    [setColumnOrder, setColumnVisibility]
  )

  const tableColumnOrder = useMemo(() => {
    return [...columnOrder, 'actions']
  }, [columnOrder])

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      minSize: PAYMENTS_MIN_COLUMN_SIZE,
    },
    state: { columnSizing, columnVisibility, columnOrder: tableColumnOrder },
    onColumnSizingChange: setColumnSizing,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
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
        <div className="flex items-center gap-2">
          {isLg && (
            <ColumnSettingsDialog
              items={[...PAYMENTS_CONFIGURABLE_COLUMNS]}
              columnOrder={columnOrder}
              columnVisibility={columnVisibility}
              defaultColumnOrder={defaultColumnOrder}
              defaultColumnVisibility={defaultColumnVisibility}
              onApply={handleColumnSettingsApply}
            />
          )}
          <Button
            className="h-10"
            onClick={() => navigate('/payments/create')}
          >
            <Plus className="mr-2 h-4 w-4" />
            Создать заявку
          </Button>
        </div>
      </div>

      {!isLg && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <PageLoadingState className="flex flex-1 items-center justify-center py-8" />
          ) : items.length === 0 ? (
            <PageNotFoundState
              message="Заявки не найдены"
              className="py-8"
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="space-y-3 pb-4">
                {items.map(payment => (
                  <PaymentCard
                    key={payment.id}
                    payment={payment}
                    formatAmount={formatAmount}
                    onView={id => navigate(`/payments/${id}`)}
                    onEdit={setEditingPaymentId}
                    onSubmit={handleSubmit}
                    onDeleteRequest={setDeletingId}
                    isSubmitting={submitMutation.isPending}
                  />
                ))}
              </div>
            </div>
          )}
          {pagination && (
            <TablePagination
              pagination={pagination}
              onPaginationChange={o => setFilters(prev => ({ ...prev, offset: o }))}
              centered
            />
          )}
        </div>
      )}

      {isLg && (
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
      )}

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
