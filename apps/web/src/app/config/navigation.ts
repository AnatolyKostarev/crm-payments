import type { LucideIcon } from 'lucide-react'
import {
  CheckSquare,
  ClipboardList,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react'

export type NavItemMatchMode = 'exact' | 'startsWith'

export interface AppNavItem {
  to: string
  label: string
  icon: LucideIcon
  matchMode: NavItemMatchMode
}

export const mainNavItems: AppNavItem[] = [
  { to: '/', label: 'Дашборд', icon: LayoutDashboard, matchMode: 'exact' },
  {
    to: '/payments',
    label: 'Заявки',
    icon: FileText,
    matchMode: 'startsWith',
  },
  {
    to: '/approvals',
    label: 'Согласование',
    icon: CheckSquare,
    matchMode: 'startsWith',
  },
  {
    to: '/contractors',
    label: 'Контрагенты',
    icon: Users,
    matchMode: 'startsWith',
  },
  {
    to: '/registries',
    label: 'Реестры',
    icon: ClipboardList,
    matchMode: 'startsWith',
  },
]

export const bottomNavItems: AppNavItem[] = [
  {
    to: '/settings',
    label: 'Настройки',
    icon: Settings,
    matchMode: 'startsWith',
  },
]

export function isNavItemActive(item: AppNavItem, pathname: string): boolean {
  if (item.matchMode === 'exact') {
    return pathname === item.to
  }

  return pathname.startsWith(item.to)
}

const STATIC_PAGE_TITLES: Record<string, string> = {
  '/': 'Дашборд',
  '/login': 'Вход',
  '/register': 'Регистрация',
  '/payments/create': 'Создание заявки',
}

export function getPageTitle(pathname: string): string {
  const staticTitle = STATIC_PAGE_TITLES[pathname]
  if (staticTitle) {
    return staticTitle
  }

  if (/^\/payments\/[^/]+$/.test(pathname)) {
    return 'Детали заявки'
  }

  const navItem = [...mainNavItems, ...bottomNavItems].find(item =>
    isNavItemActive(item, pathname)
  )

  if (navItem) {
    return navItem.label
  }

  return 'Страница не найдена'
}
