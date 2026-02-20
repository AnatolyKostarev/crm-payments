import { useEffect, useMemo, useState } from 'react'
import { Filter } from 'lucide-react'
import { toast } from 'sonner'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface PaymentDateFilterDialogProps {
  dateFrom?: string
  dateTo?: string
  onApply: (dateFrom?: string, dateTo?: string) => void
}

export function PaymentDateFilterDialog({
  dateFrom,
  dateTo,
  onApply,
}: PaymentDateFilterDialogProps) {
  const [open, setOpen] = useState(false)
  const [draftDateFrom, setDraftDateFrom] = useState<string | undefined>(dateFrom)
  const [draftDateTo, setDraftDateTo] = useState<string | undefined>(dateTo)
  const hasDateFilters = !!dateFrom || !!dateTo

  useEffect(() => {
    if (open) {
      setDraftDateFrom(dateFrom)
      setDraftDateTo(dateTo)
    }
  }, [open, dateFrom, dateTo])

  const dateToError = useMemo(() => {
    if (!draftDateFrom || !draftDateTo) return null

    const fromDate = new Date(draftDateFrom)
    const toDate = new Date(draftDateTo)
    if (toDate < fromDate) {
      return 'Дата окончания не может быть ранее даты начала'
    }

    return null
  }, [draftDateFrom, draftDateTo])

  const handleDateFromChange = (value: string) => {
    setDraftDateFrom(value || undefined)
  }

  const handleDateToChange = (value: string) => {
    setDraftDateTo(value || undefined)
  }

  const handleApply = () => {
    if (dateToError) {
      toast.error(dateToError)
      return
    }

    onApply(draftDateFrom, draftDateTo)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`h-7 w-7 ${hasDateFilters ? 'text-primary' : ''}`}
          aria-label="Фильтр по дате"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Фильтр по дате создания</DialogTitle>
          <DialogDescription>
            Выберите диапазон дат для таблицы заявок.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <DatePicker
            value={draftDateFrom}
            onChange={handleDateFromChange}
            placeholder="Дата от"
            className="h-10 w-full"
          />

          <div className="space-y-1">
            <DatePicker
              value={draftDateTo}
              onChange={handleDateToChange}
              placeholder="Дата до"
              className="h-10 w-full"
            />
            {dateToError && (
              <span className="text-xs text-destructive">{dateToError}</span>
            )}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            className="h-10"
            onClick={() => setOpen(false)}
          >
            Отмена
          </Button>
          <Button
            type="button"
            className="h-10"
            onClick={handleApply}
          >
            Применить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
