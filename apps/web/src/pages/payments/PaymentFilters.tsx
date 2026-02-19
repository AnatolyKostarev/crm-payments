import { useMemo } from 'react'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DatePicker } from '@/shared/ui/DatePicker'
import type { PaymentQuery, PaymentStatus } from '../../entities/payment/types'

const statusOptions: { value: PaymentStatus; label: string }[] = [
  { value: 'DRAFT', label: 'Черновик' },
  { value: 'PENDING_APPROVAL', label: 'На согласовании' },
  { value: 'APPROVED', label: 'Одобрена' },
  { value: 'REJECTED', label: 'Отклонена' },
  { value: 'REVISION', label: 'На доработке' },
  { value: 'IN_REGISTRY', label: 'В реестре' },
  { value: 'PAID', label: 'Оплачена' },
]

interface PaymentFiltersProps {
  filters: PaymentQuery
  onChange: (filters: PaymentQuery) => void
}

export function PaymentFilters({ filters, onChange }: PaymentFiltersProps) {
  const hasFilters = filters.status || filters.dateFrom || filters.dateTo

  // Вычисляем ошибки на основе текущих значений фильтров
  const dateToError = useMemo(() => {
    if (filters.dateFrom && filters.dateTo) {
      const fromDate = new Date(filters.dateFrom)
      const toDate = new Date(filters.dateTo)

      if (toDate < fromDate) {
        return 'Дата окончания не может быть ранее даты начала'
      }
    }
    return null
  }, [filters.dateFrom, filters.dateTo])

  const handleDateFromChange = (value: string) => {
    const newDateFrom = value || undefined
    const newDateTo = filters.dateTo

    if (newDateFrom && newDateTo) {
      const fromDate = new Date(newDateFrom)
      const toDate = new Date(newDateTo)

      if (toDate < fromDate) {
        toast.error('Дата окончания не может быть ранее даты начала')
        // Не применяем изменение, если диапазон становится невалидным
        return
      }
    }

    onChange({ ...filters, dateFrom: newDateFrom })
  }

  const handleDateToChange = (value: string) => {
    const newDateTo = value || undefined
    const newDateFrom = filters.dateFrom

    if (newDateFrom && newDateTo) {
      const fromDate = new Date(newDateFrom)
      const toDate = new Date(newDateTo)

      if (toDate < fromDate) {
        toast.error('Дата окончания не может быть ранее даты начала')
        // Не применяем изменение, если диапазон становится невалидным
        return
      }
    }

    onChange({ ...filters, dateTo: newDateTo })
  }

  const handleClear = () => {
    onChange({ limit: filters.limit, offset: 0 })
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
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Все статусы</SelectItem>
          {statusOptions.map(s => (
            <SelectItem
              key={s.value}
              value={s.value}
            >
              {s.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex flex-col gap-1">
        <DatePicker
          value={filters.dateFrom}
          onChange={handleDateFromChange}
          placeholder="Дата от"
          className="w-[160px]"
        />
      </div>
      <div className="flex flex-col gap-1">
        <DatePicker
          value={filters.dateTo}
          onChange={handleDateToChange}
          placeholder="Дата до"
          className="w-[160px]"
        />
        {dateToError && (
          <span className="text-xs text-destructive">{dateToError}</span>
        )}
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
        >
          <X className="mr-1 h-4 w-4" />
          Сбросить
        </Button>
      )}
    </div>
  )
}
