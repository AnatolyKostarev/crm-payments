import { useSessionStore } from '@/entities/session'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { statsConfig } from './config/stats-config'

export function DashboardPage() {
  const user = useSessionStore(s => s.user)

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
          ({ label, value, description, icon: Icon, iconBg, iconColor }) => (
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
                <p className="text-2xl font-bold">{value}</p>
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
