import { useEffect, useState } from 'react'
import type { ColumnSizingState } from '@tanstack/react-table'

function isColumnSizingState(
  value: unknown
): value is Record<string, number> {
  if (!value || typeof value !== 'object') return false

  return Object.values(value).every(
    size => typeof size === 'number' && Number.isFinite(size)
  )
}

export function usePersistedColumnSizing(storageKey: string) {
  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    if (typeof window === 'undefined') return {}

    try {
      const raw = localStorage.getItem(storageKey)
      if (!raw) return {}

      const parsed = JSON.parse(raw) as unknown
      return isColumnSizingState(parsed) ? parsed : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(columnSizing))
  }, [columnSizing, storageKey])

  return { columnSizing, setColumnSizing }
}
