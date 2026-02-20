import { useEffect, useMemo, useState } from 'react'
import type { VisibilityState } from '@tanstack/react-table'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Settings2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

export interface ColumnSettingsItem {
  readonly id: string
  readonly label: string
}

interface ColumnSettingsDialogProps {
  items: readonly ColumnSettingsItem[]
  columnOrder: string[]
  columnVisibility: VisibilityState
  defaultColumnOrder: string[]
  defaultColumnVisibility: VisibilityState
  onApply: (next: {
    columnOrder: string[]
    columnVisibility: VisibilityState
  }) => void
}

function normalizeOrder(
  order: string[],
  items: readonly ColumnSettingsItem[]
): string[] {
  const availableIds = items.map(item => item.id)
  const validOrder = order.filter(id => availableIds.includes(id))
  const missingIds = availableIds.filter(id => !validOrder.includes(id))
  return [...validOrder, ...missingIds]
}

function normalizeVisibility(
  visibility: VisibilityState,
  items: readonly ColumnSettingsItem[]
): VisibilityState {
  return Object.fromEntries(
    items.map(item => [item.id, visibility[item.id] ?? true] as const)
  )
}

function SortableColumnItem({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex items-center gap-2 rounded-md border px-3 py-2 bg-card',
        isDragging && 'opacity-70'
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onCheckedChange(e.target.checked)}
        className="h-4 w-4 cursor-pointer accent-primary"
      />
      <span className="flex-1 text-sm">{label}</span>
      <button
        type="button"
        className="cursor-grab text-muted-foreground active:cursor-grabbing"
        aria-label={`Переместить колонку ${label}`}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ColumnSettingsDialog({
  items,
  columnOrder,
  columnVisibility,
  defaultColumnOrder,
  defaultColumnVisibility,
  onApply,
}: ColumnSettingsDialogProps) {
  const [open, setOpen] = useState(false)
  const [draftOrder, setDraftOrder] = useState<string[]>([])
  const [draftVisibility, setDraftVisibility] = useState<VisibilityState>({})

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const orderedItems = useMemo(() => {
    const orderMap = new Map(items.map(item => [item.id, item]))
    return draftOrder.map(id => orderMap.get(id)).filter(Boolean) as ColumnSettingsItem[]
  }, [draftOrder, items])

  const allSelected = useMemo(
    () => items.length > 0 && items.every(item => draftVisibility[item.id] ?? true),
    [draftVisibility, items]
  )

  useEffect(() => {
    if (!open) return

    setDraftOrder(normalizeOrder(columnOrder, items))
    setDraftVisibility(normalizeVisibility(columnVisibility, items))
  }, [open, columnOrder, columnVisibility, items])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setDraftOrder(current => {
      const oldIndex = current.indexOf(String(active.id))
      const newIndex = current.indexOf(String(over.id))
      if (oldIndex < 0 || newIndex < 0) return current
      return arrayMove(current, oldIndex, newIndex)
    })
  }

  const handleSelectAll = (checked: boolean) => {
    setDraftVisibility(
      Object.fromEntries(items.map(item => [item.id, checked] as const))
    )
  }

  const handleReset = () => {
    setDraftOrder(normalizeOrder(defaultColumnOrder, items))
    setDraftVisibility(normalizeVisibility(defaultColumnVisibility, items))
  }

  const handleApply = () => {
    onApply({
      columnOrder: normalizeOrder(draftOrder, items),
      columnVisibility: normalizeVisibility(draftVisibility, items),
    })
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="h-10"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Настроить колонки
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Настройка колонок</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={e => handleSelectAll(e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-primary"
            />
            Выбрать всё
          </label>
          <Button
            variant="ghost"
            className="h-auto p-0 text-destructive hover:text-destructive"
            onClick={handleReset}
          >
            Сбросить
          </Button>
        </div>

        <div className="max-h-[420px] overflow-auto rounded-md border p-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={draftOrder}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {orderedItems.map(item => (
                  <SortableColumnItem
                    key={item.id}
                    id={item.id}
                    label={item.label}
                    checked={draftVisibility[item.id] ?? true}
                    onCheckedChange={checked =>
                      setDraftVisibility(prev => ({ ...prev, [item.id]: checked }))
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        <DialogFooter className="flex-row justify-end gap-2 sm:justify-end">
          <Button
            type="button"
            variant="destructive"
            className="h-10"
            onClick={() => setOpen(false)}
          >
            Отменить
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
