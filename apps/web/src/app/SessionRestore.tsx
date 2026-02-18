import { useEffect } from 'react'
import { useSessionStore, sessionApi } from '@/entities/session'

/**
 * При монтировании приложения пытается восстановить сессию через refresh (cookie).
 * После завершения (успех или ошибка) выставляет isRestoring: false.
 */
export function SessionRestore() {
  const setAuth = useSessionStore(s => s.setAuth)
  const setRestoring = useSessionStore(s => s.setRestoring)

  useEffect(() => {
    sessionApi
      .refresh()
      .then(res => {
        setAuth(res.data)
      })
      .catch(() => {
        // Нет cookie или истёк refresh — остаёмся неавторизованными
      })
      .finally(() => {
        setRestoring(false)
      })
  }, [setAuth, setRestoring])

  return null
}
