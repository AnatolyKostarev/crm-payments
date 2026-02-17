import { useAuthStore } from '@/shared/stores/auth.store'
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card'
import { FileText, CheckSquare, ClipboardList, Users } from 'lucide-react'

const stats = [
  {
    label: 'Заявки',
    value: '—',
    description: 'Всего заявок на оплату',
    icon: FileText,
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    label: 'На согласовании',
    value: '—',
    description: 'Ожидают решения',
    icon: CheckSquare,
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
  {
    label: 'Реестры',
    value: '—',
    description: 'Сформировано реестров',
    icon: ClipboardList,
    iconBg: 'bg-green-100 dark:bg-green-900/40',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    label: 'Контрагенты',
    value: '—',
    description: 'Активных контрагентов',
    icon: Users,
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
  },
]

export function DashboardPage() {
  const user = useAuthStore(s => s.user)

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Дашборд</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Добро пожаловать, {user?.name}!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, description, icon: Icon, iconBg, iconColor }) => (
          <Card
            key={label}
            className="group transition-all duration-200 hover:shadow-md"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <div className={`rounded-lg p-2 ${iconBg}`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
