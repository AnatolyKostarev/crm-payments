import type { ColumnDef } from '@tanstack/react-table'
import { ActionsMenu } from '@/shared/ui/ActionsMenu'
import type { Contractor } from '@/entities/contractor/types'
import { getContractorActions } from '../lib/get-contractor-actions'

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
        const actions = getContractorActions({
          contractor,
          onEdit,
          onDeleteRequest,
        })

        return (
          <div className="flex justify-end">
            <ActionsMenu actions={actions} />
          </div>
        )
      },
    },
  ]
}
