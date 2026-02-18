import { useState, useEffect, useRef } from 'react'

/**
 * Возвращает значение, обновлённое с задержкой (debounce).
 * Полезно для поисковых инпутов: ввод отображается сразу, запрос уходит после паузы.
 */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value)
      timeoutRef.current = null
    }, delayMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, delayMs])

  return debouncedValue
}
