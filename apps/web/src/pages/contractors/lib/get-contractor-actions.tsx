import { Pencil, Trash2 } from 'lucide-react'
import type { Contractor } from '@/entities/contractor/types'
import type { ActionItem } from '@/shared/ui/ActionsMenu'

interface GetContractorActionsParams {
  contractor: Contractor
  onEdit: (contractor: Contractor) => void
  onDeleteRequest: (id: string) => void
}

export function getContractorActions({
  contractor,
  onEdit,
  onDeleteRequest,
}: GetContractorActionsParams): ActionItem[] {
  return [
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
}
