import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ActionsMenu } from '@/shared/ui/ActionsMenu'
import type { Contractor } from '@/entities/contractor/types'
import { getContractorActions } from '../lib/get-contractor-actions'

interface ContractorCardProps {
  contractor: Contractor
  onEdit: (contractor: Contractor) => void
  onDeleteRequest: (id: string) => void
}

export function ContractorCard({
  contractor,
  onEdit,
  onDeleteRequest,
}: ContractorCardProps) {
  const actions = getContractorActions({
    contractor,
    onEdit,
    onDeleteRequest,
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="font-semibold leading-tight">{contractor.name}</span>
        <ActionsMenu actions={actions} />
      </CardHeader>
      <CardContent className="space-y-1.5 text-sm">
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">ИНН</span>
          <span className="tabular-nums">{contractor.inn}</span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Банк</span>
          <span className="truncate text-right">
            {contractor.bankName || '—'}
          </span>
        </div>
        <div className="flex justify-between gap-2">
          <span className="text-muted-foreground">Расчётный счёт</span>
          <span className="tabular-nums truncate">
            {contractor.account || '—'}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
