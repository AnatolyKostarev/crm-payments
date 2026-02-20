import { useEffect, useMemo, useState } from 'react'
import type { ColumnOrderState, VisibilityState } from '@tanstack/react-table'

interface PersistedColumnPreferences {
  columnOrder?: unknown
  columnVisibility?: unknown
}

interface UsePersistedColumnPreferencesParams {
  storageKey: string
  columnIds: string[]
}

function normalizeOrder(rawOrder: unknown, columnIds: string[]): string[] {
  if (!Array.isArray(rawOrder)) {
    return [...columnIds]
  }

  const validOrder = rawOrder.filter(
    (id): id is string => typeof id === 'string' && columnIds.includes(id)
  )
  const missingIds = columnIds.filter(id => !validOrder.includes(id))
  return [...validOrder, ...missingIds]
}

function normalizeVisibility(
  rawVisibility: unknown,
  columnIds: string[]
): VisibilityState {
  if (!rawVisibility || typeof rawVisibility !== 'object') {
    return Object.fromEntries(columnIds.map(id => [id, true]))
  }

  const entries = columnIds.map(id => {
    const value = (rawVisibility as Record<string, unknown>)[id]
    return [id, typeof value === 'boolean' ? value : true] as const
  })

  return Object.fromEntries(entries)
}

function parsePersistedPreferences(
  storageKey: string,
  columnIds: string[]
): { columnOrder: string[]; columnVisibility: VisibilityState } {
  if (typeof window === 'undefined') {
    return {
      columnOrder: [...columnIds],
      columnVisibility: Object.fromEntries(columnIds.map(id => [id, true])),
    }
  }

  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) {
      return {
        columnOrder: [...columnIds],
        columnVisibility: Object.fromEntries(columnIds.map(id => [id, true])),
      }
    }

    const parsed = JSON.parse(raw) as PersistedColumnPreferences
    return {
      columnOrder: normalizeOrder(parsed.columnOrder, columnIds),
      columnVisibility: normalizeVisibility(parsed.columnVisibility, columnIds),
    }
  } catch {
    return {
      columnOrder: [...columnIds],
      columnVisibility: Object.fromEntries(columnIds.map(id => [id, true])),
    }
  }
}

export function usePersistedColumnPreferences({
  storageKey,
  columnIds,
}: UsePersistedColumnPreferencesParams) {
  const defaultColumnOrder = useMemo(() => [...columnIds], [columnIds])
  const defaultColumnVisibility = useMemo<VisibilityState>(
    () => Object.fromEntries(columnIds.map(id => [id, true])),
    [columnIds]
  )

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>(() =>
    parsePersistedPreferences(storageKey, columnIds).columnOrder
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => parsePersistedPreferences(storageKey, columnIds).columnVisibility
  )

  const normalizedColumnOrder = useMemo(
    () => normalizeOrder(columnOrder, columnIds),
    [columnOrder, columnIds]
  )
  const normalizedColumnVisibility = useMemo(
    () => normalizeVisibility(columnVisibility, columnIds),
    [columnVisibility, columnIds]
  )

  const handleColumnOrderChange = (updater: ColumnOrderState | ((prev: ColumnOrderState) => ColumnOrderState)) => {
    setColumnOrder(prev => {
      const base = normalizeOrder(prev, columnIds)
      const nextValue =
        typeof updater === 'function' ? updater(base) : updater
      return normalizeOrder(nextValue, columnIds)
    })
  }

  const handleColumnVisibilityChange = (
    updater:
      | VisibilityState
      | ((prev: VisibilityState) => VisibilityState)
  ) => {
    setColumnVisibility(prev => {
      const base = normalizeVisibility(prev, columnIds)
      const nextValue =
        typeof updater === 'function' ? updater(base) : updater
      return normalizeVisibility(nextValue, columnIds)
    })
  }

  useEffect(() => {
    const payload = {
      columnOrder: normalizedColumnOrder,
      columnVisibility: normalizedColumnVisibility,
    }
    localStorage.setItem(storageKey, JSON.stringify(payload))
  }, [
    normalizedColumnOrder,
    normalizedColumnVisibility,
    storageKey,
  ])

  const resetPreferences = () => {
    handleColumnOrderChange(defaultColumnOrder)
    handleColumnVisibilityChange(defaultColumnVisibility)
  }

  return {
    columnOrder: normalizedColumnOrder,
    setColumnOrder: handleColumnOrderChange,
    columnVisibility: normalizedColumnVisibility,
    setColumnVisibility: handleColumnVisibilityChange,
    defaultColumnOrder,
    defaultColumnVisibility,
    resetPreferences,
  }
}
