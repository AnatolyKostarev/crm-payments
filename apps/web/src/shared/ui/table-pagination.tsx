import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PaginationMeta } from '@/shared/types'

function paginationPages(
  currentPage: number,
  totalPages: number
): (number | 'ellipsis')[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }
  const pages: (number | 'ellipsis')[] = [1]
  const windowStart = Math.max(2, currentPage - 1)
  const windowEnd = Math.min(totalPages - 1, currentPage + 1)

  if (windowStart > 2) pages.push('ellipsis')
  for (let i = windowStart; i <= windowEnd; i++) {
    pages.push(i)
  }
  if (windowEnd < totalPages - 1) pages.push('ellipsis')
  if (totalPages > 1) pages.push(totalPages)

  return pages
}

interface TablePaginationProps {
  pagination: PaginationMeta
  onPaginationChange?: (offset: number) => void
  className?: string
  /** Центрировать блок (текст и кнопки по центру) */
  centered?: boolean
}

export function TablePagination({
  pagination,
  onPaginationChange,
  className,
  centered = false,
}: TablePaginationProps) {
  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1
  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit))
  const pages = paginationPages(currentPage, totalPages)

  return (
    <div
      className={cn(
        'flex shrink-0 flex-wrap items-center gap-3 px-2',
        centered
          ? 'flex-col justify-center'
          : 'justify-between',
        className
      )}
    >
      <p className="text-sm text-muted-foreground">
        Показано {pagination.offset + 1}–
        {Math.min(pagination.offset + pagination.limit, pagination.total)} из{' '}
        {pagination.total}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPaginationChange?.(
              Math.max(0, pagination.offset - pagination.limit)
            )
          }
          disabled={pagination.offset === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Назад
        </Button>
        <div className="flex items-center gap-1 px-1">
          {pages.map((p, i) =>
            p === 'ellipsis' ? (
              <span
                key={`ellipsis-${i}`}
                className="px-2 text-sm text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={p}
                variant={p === currentPage ? 'secondary' : 'ghost'}
                size="sm"
                className={cn(
                  'h-8 min-w-8 px-2',
                  p === currentPage && 'pointer-events-none'
                )}
                onClick={() =>
                  onPaginationChange?.((p - 1) * pagination.limit)
                }
              >
                {p}
              </Button>
            )
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            onPaginationChange?.(pagination.offset + pagination.limit)
          }
          disabled={!pagination.hasMore}
        >
          Вперёд
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
