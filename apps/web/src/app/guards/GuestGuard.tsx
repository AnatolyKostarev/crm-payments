import { Navigate } from 'react-router'
import { useSessionStore } from '@/entities/session'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const isAuthenticated = useSessionStore(s => s.isAuthenticated)

  if (isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return <>{children}</>
}
