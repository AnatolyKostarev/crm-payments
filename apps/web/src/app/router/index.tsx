import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router'
import { AuthGuard } from '@/app/guards/AuthGuard'
import { GuestGuard } from '@/app/guards/GuestGuard'
import { getPageTitle } from '@/app/config/navigation'
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
const PaymentsListPage = lazy(() =>
  import('@/pages/payments/PaymentsListPage').then(m => ({ default: m.PaymentsListPage }))
)
const PaymentCreatePage = lazy(() =>
  import('@/pages/payments/PaymentCreatePage').then(m => ({ default: m.PaymentCreatePage }))
)
const PaymentDetailPage = lazy(() =>
  import('@/pages/payments/PaymentDetailPage').then(m => ({ default: m.PaymentDetailPage }))
)
const NotFoundPage = lazy(() =>
  import('@/pages/not-found/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
)

const APP_NAME = 'CRM Payments'

function DocumentTitleManager() {
  const location = useLocation()

  useEffect(() => {
    document.title = `${getPageTitle(location.pathname)} | ${APP_NAME}`
  }, [location.pathname])

  return null
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <DocumentTitleManager />
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
          <Route path="/payments" element={<PaymentsListPage />} />
          <Route path="/payments/create" element={<PaymentCreatePage />} />
          <Route path="/payments/:id" element={<PaymentDetailPage />} />
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
