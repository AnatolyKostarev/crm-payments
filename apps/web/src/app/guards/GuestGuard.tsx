import { Navigate } from 'react-router'
import { Loader2 } from 'lucide-react'
import { useSessionStore } from '@/entities/session'

interface GuestGuardProps {
  children: React.ReactNode
}

export function GuestGuard({ children }: GuestGuardProps) {
  const isAuthenticated = useSessionStore(s => s.isAuthenticated)
  const isRestoring = useSessionStore(s => s.isRestoring)

  if (isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
