/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  flexRender,
  type ColumnDef,
  type Table as TanstackTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import type { PaginationMeta } from '@/shared/types'

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  columns: ColumnDef<TData, any>[]
  isLoading?: boolean
  pagination?: PaginationMeta
  onPaginationChange?: (offset: number) => void
  emptyMessage?: string
}

export function DataTable<TData>({
  table,
  columns,
  isLoading,
  pagination,
  onPaginationChange,
  emptyMessage = 'Нет данных',
}: DataTableProps<TData>) {
  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="min-h-0 flex-1 overflow-auto rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(hg => (
              <TableRow key={hg.id} className="sticky top-0 z-10 border-b bg-muted/50 backdrop-blur supports-backdrop-filter:bg-muted/80">
                {hg.headers.map(header => (
                  <TableHead key={header.id} className="bg-inherit">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex shrink-0 items-center justify-between px-2">
          <p className="text-sm text-muted-foreground">
            Показано {pagination.offset + 1}–
            {Math.min(pagination.offset + pagination.limit, pagination.total)}{' '}
            из {pagination.total}
          </p>
          <div className="flex items-center gap-2">
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
      )}
    </div>
  )
}
