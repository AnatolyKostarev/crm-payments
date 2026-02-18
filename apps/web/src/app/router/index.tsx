import { Routes, Route } from 'react-router'
import { AuthGuard } from '@/app/guards/AuthGuard'
import { GuestGuard } from '@/app/guards/GuestGuard'
import { LoginPage } from '@/pages/login/LoginPage'
import { RegisterPage } from '@/pages/register/RegisterPage'
import { DashboardPage } from '@/pages/dashboard/DashboardPage'
import { ContractorsPage } from '@/pages/contractors/ContractorsPage'
import { NotFoundPage } from '@/pages/not-found/NotFoundPage'
import { AppLayout } from '@/widgets/app-layout/AppLayout'

export function AppRouter() {
  return (
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
  )
}
