import { useSessionStore } from '@/entities/session'
import { usePayments } from '@/entities/payment/hooks'
import { useContractors } from '@/entities/contractor/hooks'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { statsConfig } from './config/stats-config'

const numberFormatter = new Intl.NumberFormat('ru-RU')

function formatStatValue(value: number | undefined, isLoading: boolean) {
  if (isLoading) return '...'
  return numberFormatter.format(value ?? 0)
}

export function DashboardPage() {
  const user = useSessionStore(s => s.user)
  const paymentsQuery = usePayments({ limit: 1, offset: 0 })
  const pendingApprovalQuery = usePayments({
    limit: 1,
    offset: 0,
    status: 'PENDING_APPROVAL',
  })
  const registriesQuery = usePayments({ limit: 1, offset: 0, status: 'IN_REGISTRY' })
  const contractorsQuery = useContractors({ limit: 1, offset: 0 })

  const statValues = {
    payments: formatStatValue(
      paymentsQuery.data?.data.pagination.total,
      paymentsQuery.isLoading
    ),
    pendingApproval: formatStatValue(
      pendingApprovalQuery.data?.data.pagination.total,
      pendingApprovalQuery.isLoading
    ),
    registries: formatStatValue(
      registriesQuery.data?.data.pagination.total,
      registriesQuery.isLoading
    ),
    contractors: formatStatValue(
      contractorsQuery.data?.data.pagination.total,
      contractorsQuery.isLoading
    ),
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Дашборд
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          Добро пожаловать, {user?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsConfig.map(
          ({ key, label, description, icon: Icon, iconBg, iconColor }) => (
            <Card
              key={label}
              className="group transition-all duration-200 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {label}
                </p>
                <div className={`rounded-lg p-2 ${iconBg}`}>
                  <Icon className={`h-4 w-4 ${iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{statValues[key]}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  )
}
