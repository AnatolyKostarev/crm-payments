import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Contractor } from '@/entities/contractor/types'

export interface ContractorsColumnsParams {
  onEdit: (contractor: Contractor) => void
  onDeleteRequest: (id: string) => void
}

export function getContractorsColumns({
  onEdit,
  onDeleteRequest,
}: ContractorsColumnsParams): ColumnDef<Contractor>[] {
  return [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ row }) => (
        <span className="font-medium">{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'inn',
      header: 'ИНН',
    },
    {
      accessorKey: 'bankName',
      header: 'Банк',
      cell: ({ row }) => row.original.bankName || '—',
    },
    {
      accessorKey: 'account',
      header: 'Расчётный счёт',
      cell: ({ row }) => row.original.account || '—',
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(row.original)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDeleteRequest(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]
}
