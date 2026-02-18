import { Navigate, useLocation } from 'react-router'
import { Loader2 } from 'lucide-react'
import { useSessionStore } from '@/entities/session'

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const isAuthenticated = useSessionStore(s => s.isAuthenticated)
  const isRestoring = useSessionStore(s => s.isRestoring)
  const location = useLocation()

  if (isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    )
  }

  return <>{children}</>
}
