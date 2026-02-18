import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { AuthGuard } from '@/app/guards/AuthGuard'
import { GuestGuard } from '@/app/guards/GuestGuard'
import { AppLayout } from '@/widgets/app-layout/AppLayout'
import { PageLoader } from '@/shared/ui/page-loader'

const LoginPage = lazy(() =>
  import('@/pages/login/LoginPage').then(m => ({ default: m.LoginPage }))
)
const RegisterPage = lazy(() =>
  import('@/pages/register/RegisterPage').then(m => ({ default: m.RegisterPage }))
)
const DashboardPage = lazy(() =>
  import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage }))
)
const ContractorsPage = lazy(() =>
  import('@/pages/contractors/ContractorsPage').then(m => ({ default: m.ContractorsPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
)

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public */}
        <Route
          path="/login"
          element={
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          }
        />
        <Route
          path="/register"
          element={
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          }
        />

        {/* Protected */}
        <Route
          element={
            <AuthGuard>
              <AppLayout />
            </AuthGuard>
          }
        >
          <Route path="/" element={<DashboardPage />} />
          <Route path="/payments" element={<div className="text-muted-foreground">Заявки — в разработке</div>} />
          <Route path="/approvals" element={<div className="text-muted-foreground">Согласование — в разработке</div>} />
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/registries" element={<div className="text-muted-foreground">Реестры — в разработке</div>} />
          <Route path="/settings" element={<div className="text-muted-foreground">Настройки — в разработке</div>} />
          <Route path="*" element={<NotFoundPage fullScreen={false} />} />
        </Route>

        {/* 404 without layout (for unauthenticated) */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
