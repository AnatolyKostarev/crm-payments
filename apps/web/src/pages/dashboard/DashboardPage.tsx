import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
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
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useContractors } from '@/entities/contractor/hooks'
import { usePayments } from '@/entities/payment/hooks'
import { useSessionStore } from '@/entities/session'
import { statsConfig } from './config/stats-config'

const numberFormatter = new Intl.NumberFormat('ru-RU')
const DASHBOARD_CARD_ORDER_STORAGE_KEY = 'dashboard-card-order-v1'
type DashboardStatKey = (typeof statsConfig)[number]['key']
const defaultCardOrder: DashboardStatKey[] = statsConfig.map(stat => stat.key)
const statsByKey = new Map(statsConfig.map(stat => [stat.key, stat] as const))

function formatStatValue(value: number | undefined, isLoading: boolean) {
  if (isLoading) return '...'
  return numberFormatter.format(value ?? 0)
}

function normalizeCardOrder(order: DashboardStatKey[]) {
  const uniqueOrder = order.filter(
    (id, index) => defaultCardOrder.includes(id) && order.indexOf(id) === index
  )
  const missingIds = defaultCardOrder.filter(id => !uniqueOrder.includes(id))
  return [...uniqueOrder, ...missingIds]
}

function loadCardOrderFromStorage(): DashboardStatKey[] {
  try {
    const rawValue = localStorage.getItem(DASHBOARD_CARD_ORDER_STORAGE_KEY)
    if (!rawValue) return defaultCardOrder

    const parsed = JSON.parse(rawValue)
    if (!Array.isArray(parsed)) return defaultCardOrder

    const normalized = normalizeCardOrder(
      parsed.filter((id): id is DashboardStatKey => typeof id === 'string')
    )
    return normalized.length > 0 ? normalized : defaultCardOrder
  } catch {
    return defaultCardOrder
  }
}

function SortableStatCardBase({
  stat,
  value,
  onNavigate,
}: {
  stat: (typeof statsConfig)[number]
  value: string
  onNavigate: (to: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: stat.key })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition:
      transition ??
      'transform 320ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 320ms ease, border-color 320ms ease, opacity 260ms ease',
  }

  const Icon = stat.icon

  return (
    <Card
      ref={setNodeRef}
      style={style}
      role="button"
      tabIndex={0}
      onClick={() => onNavigate(stat.to)}
      onKeyDown={event => {
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onNavigate(stat.to)
      }}
      className={cn(
        'group relative overflow-hidden border-border/60 cursor-pointer will-change-transform',
        'transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]',
        'hover:border-primary/35 hover:shadow-[0_10px_28px_-18px_hsl(var(--primary)/0.35)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        isDragging &&
          'z-20 cursor-grabbing border-primary/50 shadow-[0_16px_34px_-20px_hsl(var(--primary)/0.5)]'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={cn(
              'rounded-md p-1 text-muted-foreground/70 transition-colors hover:text-foreground',
              isDragging ? 'cursor-grabbing' : 'cursor-grab'
            )}
            aria-label={`Переместить карточку ${stat.label}`}
            onClick={event => event.stopPropagation()}
            onKeyDown={event => event.stopPropagation()}
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>
          <div
            className={cn(
              `rounded-lg p-2 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${stat.iconBg}`,
              'group-hover:scale-105',
              isDragging && 'scale-105'
            )}
          >
            <Icon className={`h-4 w-4 ${stat.iconColor}`} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
      </CardContent>
    </Card>
  )
}

const SortableStatCard = memo(
  SortableStatCardBase,
  (prevProps, nextProps) =>
    prevProps.value === nextProps.value && prevProps.stat.key === nextProps.stat.key
)

export function DashboardPage() {
  const navigate = useNavigate()
  const userName = useSessionStore(s => s.user?.name)
  const [cardOrder, setCardOrder] = useState<DashboardStatKey[]>(() =>
    loadCardOrderFromStorage()
  )
  const paymentsQuery = usePayments({ limit: 1, offset: 0 })
  const pendingApprovalQuery = usePayments({
    limit: 1,
    offset: 0,
    status: 'PENDING_APPROVAL',
  })
  const registriesQuery = usePayments({ limit: 1, offset: 0, status: 'IN_REGISTRY' })
  const contractorsQuery = useContractors({ limit: 1, offset: 0 })

  const statValues = useMemo(
    () => ({
      payments: formatStatValue(
        paymentsQuery.data?.data.pagination.total,
        paymentsQuery.isLoading
      ),
      pendingApproval: formatStatValue(
        pendingApprovalQuery.data?.data.pagination.total,
        pendingApprovalQuery.isLoading
      ),
      registries: formatStatValue(
        registriesQuery.data?.data.pagination.total,
        registriesQuery.isLoading
      ),
      contractors: formatStatValue(
        contractorsQuery.data?.data.pagination.total,
        contractorsQuery.isLoading
      ),
    }),
    [
      paymentsQuery.data?.data.pagination.total,
      paymentsQuery.isLoading,
      pendingApprovalQuery.data?.data.pagination.total,
      pendingApprovalQuery.isLoading,
      registriesQuery.data?.data.pagination.total,
      registriesQuery.isLoading,
      contractorsQuery.data?.data.pagination.total,
      contractorsQuery.isLoading,
    ]
  )

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const orderedStats = useMemo(() => {
    return cardOrder
      .map(key => statsByKey.get(key))
      .filter(Boolean) as (typeof statsConfig)[number][]
  }, [cardOrder])

  useEffect(() => {
    localStorage.setItem(
      DASHBOARD_CARD_ORDER_STORAGE_KEY,
      JSON.stringify(normalizeCardOrder(cardOrder))
    )
  }, [cardOrder])

  const handleCardNavigate = useCallback(
    (to: string) => {
      navigate(to)
    },
    [navigate]
  )

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setCardOrder(current => {
      const oldIndex = current.indexOf(String(active.id) as DashboardStatKey)
      const newIndex = current.indexOf(String(over.id) as DashboardStatKey)
      if (oldIndex < 0 || newIndex < 0) return current
      return arrayMove(current, oldIndex, newIndex)
    })
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Дашборд
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Добро пожаловать, {userName}!
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={cardOrder}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {orderedStats.map(stat => (
              <SortableStatCard
                key={stat.key}
                stat={stat}
                value={statValues[stat.key]}
                onNavigate={handleCardNavigate}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
