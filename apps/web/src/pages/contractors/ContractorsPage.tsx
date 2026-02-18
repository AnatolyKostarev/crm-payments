import { useState, useMemo, useCallback, useRef } from 'react'
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'
import {
  useContractors,
  useDeleteContractor,
} from '@/entities/contractor/hooks'
import { DataTable } from '@/shared/ui/DataTable'
import { ContractorDialog } from '@/features/manage-contractor/ContractorDialog'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import { SearchInput } from '@/shared/ui/search-input'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import type { Contractor } from '@/entities/contractor/types'
import { getContractorsColumns } from './config/contractors-columns'

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

  const columns = useMemo(
    () => getContractorsColumns({ onEdit: handleEdit, onDeleteRequest }),
    [handleEdit, onDeleteRequest]
  )

  const tableOptions = useMemo(
    () => ({
      data: items,
      columns,
      getCoreRowModel: getCoreRowModel(),
    }),
    [items, columns]
  )
  const table = useReactTable(tableOptions)

  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <h2 className="shrink-0 text-2xl font-bold tracking-tight">
        Контрагенты
      </h2>

      {/* Search and Add */}
      <div className="flex shrink-0 items-center gap-3">
        <SearchInput
          placeholder="Поиск по названию или ИНН..."
          value={search}
          onChange={handleSearchChange}
        />
        <Button
          onClick={handleCreate}
          className="h-10"
        >
          <Plus className="mr-2 h-4 w-4" />
          Добавить
        </Button>
      </div>

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
