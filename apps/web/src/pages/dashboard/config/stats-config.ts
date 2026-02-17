import type { LucideIcon } from 'lucide-react'
import { FileText, CheckSquare, ClipboardList, Users } from 'lucide-react'

export interface StatCard {
  label: string
  value: string | number
  description: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export const statsConfig: StatCard[] = [
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
