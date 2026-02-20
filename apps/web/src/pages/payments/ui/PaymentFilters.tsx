import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { paymentStatusOptions } from '@/entities/payment/lib/status-meta'
import type { PaymentQuery, PaymentStatus } from '../../../entities/payment/types'

interface PaymentFiltersProps {
  filters: PaymentQuery
  onChange: (filters: PaymentQuery) => void
}

export function PaymentFilters({ filters, onChange }: PaymentFiltersProps) {
  const hasFilters =
    !!filters.status ||
    !!filters.dateFrom ||
    !!filters.dateTo ||
    !!filters.contractorIds?.length

  const handleClear = () => {
    onChange({
      ...filters,
      status: undefined,
      contractorId: undefined,
      contractorIds: undefined,
      dateFrom: undefined,
      dateTo: undefined,
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Select
        value={filters.status || 'ALL'}
        onValueChange={v =>
          onChange({
            ...filters,
            status: v === 'ALL' ? undefined : (v as PaymentStatus),
          })
        }
      >
        <SelectTrigger className="h-10 w-[180px]">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Все статусы</SelectItem>
          {paymentStatusOptions.map(s => (
            <SelectItem
              key={s.value}
              value={s.value}
            >
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          className="h-10"
          onClick={handleClear}
        >
          <X className="mr-1 h-4 w-4" />
          Сбросить
        </Button>
      )}
    </div>
  )
}
