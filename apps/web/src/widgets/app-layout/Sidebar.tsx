import { NavLink, useLocation } from 'react-router'
import {
  LayoutDashboard,
  FileText,
  Users,
  CheckSquare,
  ClipboardList,
  Settings,
} from 'lucide-react'
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupContent,
} from '@/components/ui/sidebar'

const navItems = [
  { to: '/', label: 'Дашборд', icon: LayoutDashboard },
  { to: '/payments', label: 'Заявки', icon: FileText },
  { to: '/approvals', label: 'Согласование', icon: CheckSquare },
  { to: '/contractors', label: 'Контрагенты', icon: Users },
  { to: '/registries', label: 'Реестры', icon: ClipboardList },
]

const bottomItems = [{ to: '/settings', label: 'Настройки', icon: Settings }]

interface AppSidebarProps {
  onNavigate?: () => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const location = useLocation()

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <NavLink to="/" onClick={onNavigate}>
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">CP</span>
                </div>
                <span className="font-semibold">CRM Payments</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ to, label, icon: Icon }) => {
                const isActive = to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to)

                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                    >
                      <NavLink to={to} onClick={onNavigate}>
                        <Icon />
                        <span>{label}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <SidebarMenu>
          {bottomItems.map(({ to, label, icon: Icon }) => {
            const isActive = location.pathname.startsWith(to)

            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={label}
                >
                  <NavLink to={to} onClick={onNavigate}>
                    <Icon />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarFooter>
    </ShadcnSidebar>
  )
}
