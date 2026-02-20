import { useState, useMemo, useCallback, useRef } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  type VisibilityState,
} from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  useContractors,
  useDeleteContractor,
} from '@/entities/contractor/hooks'
import { DataTable } from '@/shared/ui/DataTable'
import { TablePagination } from '@/shared/ui/table-pagination'
import { ContractorDialog } from '@/features/manage-contractor/ContractorDialog'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { SearchInput } from '@/shared/ui/search-input'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { useIsLg } from '@/shared/hooks/use-mobile'
import { usePersistedColumnSizing } from '@/shared/hooks/use-persisted-column-sizing'
import { usePersistedColumnPreferences } from '@/shared/hooks/use-persisted-column-preferences'
import { PageLoadingState, PageNotFoundState } from '@/shared/ui/page-state'
import type { Contractor } from '@/entities/contractor/types'
import { getContractorsColumns } from './config/contractors-columns'
import { ContractorCard } from './ui/ContractorCard'
import { ColumnSettingsDialog } from '@/shared/ui/ColumnSettingsDialog'
import {
  CONTRACTORS_COLUMN_SIZING_STORAGE_KEY,
  CONTRACTORS_COLUMN_PREFERENCES_STORAGE_KEY,
  CONTRACTORS_MIN_COLUMN_SIZE,
  CONTRACTORS_CONFIGURABLE_COLUMNS,
  CONTRACTORS_CONFIGURABLE_COLUMN_IDS,
} from './config/column-settings'

const SEARCH_DEBOUNCE_MS = 300
const EMPTY_ITEMS: Contractor[] = []

export function ContractorsPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebouncedValue(search, SEARCH_DEBOUNCE_MS)
  const [offset, setOffset] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(
    null
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { columnSizing, setColumnSizing } = usePersistedColumnSizing(
    CONTRACTORS_COLUMN_SIZING_STORAGE_KEY
  )
  const {
    columnOrder,
    setColumnOrder,
    columnVisibility,
    setColumnVisibility,
    defaultColumnOrder,
    defaultColumnVisibility,
  } = usePersistedColumnPreferences({
    storageKey: CONTRACTORS_COLUMN_PREFERENCES_STORAGE_KEY,
    columnIds: CONTRACTORS_CONFIGURABLE_COLUMN_IDS,
  })

  const { data, isLoading } = useContractors({
    search: debouncedSearch || undefined,
    offset,
    limit: 20,
  })
  const deleteContractor = useDeleteContractor()

  const items = data?.data?.items ?? EMPTY_ITEMS
  const pagination = data?.data?.pagination

  const handleEdit = useCallback((contractor: Contractor) => {
    setEditingContractor(contractor)
    setDialogOpen(true)
  }, [])

  const handleCreate = useCallback(() => {
    setEditingContractor(null)
    setDialogOpen(true)
  }, [])

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value)
      setOffset(0)
    },
    []
  )

  const handleConfirmDialogOpenChange = useCallback((open: boolean) => {
    if (!open) setDeletingId(null)
  }, [])

  const deletingIdRef = useRef<string | null>(null)
  deletingIdRef.current = deletingId

  const handleDelete = useCallback(async () => {
    const id = deletingIdRef.current
    if (!id) return
    try {
      await deleteContractor.mutateAsync(id)
      toast.success('Контрагент удалён')
    } catch {
      toast.error('Ошибка удаления')
    } finally {
      setDeletingId(null)
    }
  }, [deleteContractor])

  const onDeleteRequest = useCallback((id: string) => setDeletingId(id), [])
  const handleColumnSettingsApply = useCallback(
    (next: { columnOrder: string[]; columnVisibility: VisibilityState }) => {
      setColumnOrder(next.columnOrder)
      setColumnVisibility(next.columnVisibility)
    },
    [setColumnOrder, setColumnVisibility]
  )

  const columns = useMemo(
    () => getContractorsColumns({ onEdit: handleEdit, onDeleteRequest }),
    [handleEdit, onDeleteRequest]
  )
  const tableColumnOrder = useMemo(() => [...columnOrder, 'actions'], [columnOrder])

  const tableOptions = useMemo(
    () => ({
      data: items,
      columns,
      getCoreRowModel: getCoreRowModel(),
      defaultColumn: {
        minSize: CONTRACTORS_MIN_COLUMN_SIZE,
      },
      state: { columnSizing, columnVisibility, columnOrder: tableColumnOrder },
      onColumnSizingChange: setColumnSizing,
      onColumnVisibilityChange: setColumnVisibility,
      onColumnOrderChange: setColumnOrder,
      columnResizeMode: 'onChange' as const,
      enableColumnResizing: true,
    }),
    [
      items,
      columns,
      columnSizing,
      columnVisibility,
      tableColumnOrder,
      setColumnSizing,
      setColumnVisibility,
      setColumnOrder,
    ]
  )
  const table = useReactTable(tableOptions)
  const isLg = useIsLg()

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <h2 className="shrink-0 text-2xl font-bold tracking-tight">
        Контрагенты
      </h2>

      {/* Search and Add */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <SearchInput
          placeholder="Поиск по названию или ИНН..."
          value={search}
          onChange={handleSearchChange}
        />
        <div className="flex items-center gap-2">
          {isLg && (
            <ColumnSettingsDialog
              items={[...CONTRACTORS_CONFIGURABLE_COLUMNS]}
              columnOrder={columnOrder}
              columnVisibility={columnVisibility}
              defaultColumnOrder={defaultColumnOrder}
              defaultColumnVisibility={defaultColumnVisibility}
              onApply={handleColumnSettingsApply}
            />
          )}
          <Button
            onClick={handleCreate}
            className="h-10"
          >
            <Plus className="mr-2 h-4 w-4" />
            Добавить
          </Button>
        </div>
      </div>

      {/* До 1024px — только карточки (таблица не рендерится, нет дублирования и переполнения) */}
      {!isLg && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {isLoading ? (
            <PageLoadingState className="flex flex-1 items-center justify-center py-8" />
          ) : items.length === 0 ? (
            <PageNotFoundState
              message="Контрагенты не найдены"
              className="py-8"
            />
          ) : (
            <div className="min-h-0 flex-1 overflow-auto">
              <div className="space-y-3 pb-4">
                {items.map(contractor => (
                  <ContractorCard
                    key={contractor.id}
                    contractor={contractor}
                    onEdit={handleEdit}
                    onDeleteRequest={onDeleteRequest}
                  />
                ))}
              </div>
            </div>
          )}
          {pagination && (
            <TablePagination
              pagination={pagination}
              onPaginationChange={setOffset}
              centered
            />
          )}
        </div>
      )}

      {/* От 1024px — только таблица */}
      {isLg && (
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <DataTable
            table={table}
            columns={columns}
            isLoading={isLoading}
            pagination={pagination}
            onPaginationChange={setOffset}
            emptyMessage="Контрагенты не найдены"
          />
        </div>
      )}

      {/* Create/Edit Dialog */}
      <ContractorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        contractor={editingContractor}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        open={!!deletingId}
        onOpenChange={handleConfirmDialogOpenChange}
        title="Удалить контрагента?"
        description="Контрагент будет деактивирован. Связанные заявки сохранятся."
        confirmLabel="Удалить"
        cancelLabel="Отмена"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </div>
  )
}
