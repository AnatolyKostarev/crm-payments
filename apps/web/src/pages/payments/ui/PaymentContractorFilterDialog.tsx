import { useEffect, useMemo, useState } from 'react'
import { Check, Filter } from 'lucide-react'
import { useContractors } from '@/entities/contractor/hooks'
import { useDebouncedValue } from '@/shared/hooks/use-debounced-value'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

interface PaymentContractorFilterDialogProps {
  contractorIds?: string[]
  onApply: (contractorIds?: string[]) => void
}

const PAGE_SIZE = 20
const EMPTY_SELECTED_IDS: string[] = []
const EMPTY_ITEMS: Array<{ id: string; name: string; inn: string }> = []

export function PaymentContractorFilterDialog({
  contractorIds,
  onApply,
}: PaymentContractorFilterDialogProps) {
  const appliedContractorIds = contractorIds ?? EMPTY_SELECTED_IDS
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [offset, setOffset] = useState(0)
  const [items, setItems] = useState<Array<{ id: string; name: string; inn: string }>>([])
  const [draftSelectedIds, setDraftSelectedIds] = useState<string[]>(appliedContractorIds)

  const debouncedSearch = useDebouncedValue(search, 250)
  const hasContractorFilter = appliedContractorIds.length > 0

  const { data, isLoading, isFetching } = useContractors({
    search: debouncedSearch || undefined,
    offset,
    limit: PAGE_SIZE,
  }, { enabled: open })

  const pagination = data?.data?.pagination
  const hasMore = !!pagination?.hasMore
  const currentPageItems = data?.data?.items ?? EMPTY_ITEMS

  useEffect(() => {
    if (!open) return
    setDraftSelectedIds(appliedContractorIds)
    setSearch('')
    setOffset(0)
  }, [open, appliedContractorIds])

  useEffect(() => {
    if (!open) return
    setOffset(0)
    setItems([])
  }, [debouncedSearch, open])

  useEffect(() => {
    if (!open) return
    if (offset === 0) {
      setItems(currentPageItems)
      return
    }

    setItems((prev) => {
      const map = new Map(prev.map((item) => [item.id, item]))
      for (const item of currentPageItems) {
        map.set(item.id, item)
      }
      return Array.from(map.values())
    })
  }, [currentPageItems, offset, open])

  const selectedCount = useMemo(() => draftSelectedIds.length, [draftSelectedIds])

  const toggleSelect = (id: string) => {
    setDraftSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    )
  }

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (isFetching || !hasMore) return

    const target = e.currentTarget
    const reachedBottom =
      target.scrollTop + target.clientHeight >= target.scrollHeight - 24

    if (reachedBottom) {
      setOffset((prev) => prev + PAGE_SIZE)
    }
  }

  const handleApply = () => {
    onApply(draftSelectedIds.length > 0 ? draftSelectedIds : undefined)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative inline-flex">
          <Button
            variant="ghost"
            size="icon"
            className={`h-7 w-7 ${hasContractorFilter ? 'text-primary' : ''}`}
            aria-label="Фильтр по контрагенту"
          >
            <Filter className="h-4 w-4" />
          </Button>
          {hasContractorFilter && (
            <Badge
              variant="secondary"
              className="pointer-events-none absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1 text-[10px] leading-none"
            >
              {appliedContractorIds.length}
            </Badge>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Фильтр по контрагентам</DialogTitle>
          <DialogDescription>
            Можно выбрать несколько контрагентов.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию или ИНН..."
            className="h-10"
          />

          <div
            className="max-h-72 overflow-auto rounded-md border"
            onScroll={handleScroll}
          >
            {isLoading && items.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">Загрузка...</p>
            ) : items.length === 0 ? (
              <p className="p-3 text-sm text-muted-foreground">Контрагенты не найдены</p>
            ) : (
              <div className="divide-y">
                {items.map((contractor) => {
                  const isSelected = draftSelectedIds.includes(contractor.id)
                  return (
                    <button
                      key={contractor.id}
                      type="button"
                      onClick={() => toggleSelect(contractor.id)}
                      className="flex w-full items-start gap-2 p-3 text-left hover:bg-muted/50"
                    >
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          isSelected ? 'opacity-100 text-primary' : 'opacity-0'
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{contractor.name}</p>
                        <p className="text-xs text-muted-foreground">ИНН: {contractor.inn}</p>
                      </div>
                    </button>
                  )
                })}
                {isFetching && hasMore && (
                  <p className="p-3 text-sm text-muted-foreground">Загрузка...</p>
                )}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:justify-end">
          <Button type="button" variant="outline" className="h-10" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="button" className="h-10" onClick={handleApply}>
            Применить{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
