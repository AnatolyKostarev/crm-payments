import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import type { Contractor } from '@/entities/contractor/types'

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
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <span className="font-semibold leading-tight">{contractor.name}</span>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => onEdit(contractor)}
            aria-label="Редактировать"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive hover:text-destructive"
            onClick={() => onDeleteRequest(contractor.id)}
            aria-label="Удалить"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
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
