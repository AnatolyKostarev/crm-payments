import type { ColumnDef } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { ActionsMenu, type ActionItem } from '@/shared/ui/ActionsMenu'
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
      cell: ({ row }) => {
        const contractor = row.original
        const actions: ActionItem[] = [
          {
            label: 'Изменить',
            icon: <Pencil className="h-4 w-4" />,
            onClick: () => onEdit(contractor),
          },
          {
            label: 'Удалить',
            icon: <Trash2 className="h-4 w-4" />,
            onClick: () => onDeleteRequest(contractor.id),
            variant: 'destructive',
            separator: true,
          },
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
