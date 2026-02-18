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
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { TablePagination } from '@/shared/ui/table-pagination'
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
        <TablePagination
          pagination={pagination}
          onPaginationChange={onPaginationChange}
        />
      )}
    </div>
  )
}
