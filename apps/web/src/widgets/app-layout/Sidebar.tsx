import { NavLink, useLocation } from 'react-router'
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
  useSidebar,
} from '@/components/ui/sidebar'
import {
  bottomNavItems,
  isNavItemActive,
  mainNavItems,
} from '@/app/config/navigation'
import LogoIcon from '../../assets/logo.png'
import { useState } from 'react'

interface AppSidebarProps {
  onNavigate?: () => void
}

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const [logoBroken, setLogoBroken] = useState(false)

  const location = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
    onNavigate?.()
  }

  return (
    <ShadcnSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
            >
              <NavLink
                to="/"
                onClick={handleNavigate}
              >
                <div className="mx-auto mb-0 flex h-8 w-8 items-center justify-center text-sm font-bold text-primary">
                  {!logoBroken ? (
                    <img
                      src={LogoIcon}
                      alt="CRM Payments logo"
                      className="h-8 w-8 object-contain rounded-md"
                      onError={() => setLogoBroken(true)}
                    />
                  ) : (
                    <span className="text-sm font-bold">CP</span>
                  )}
                </div>
                {/* <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="text-sm font-bold">CP</span>
                </div> */}
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
              {mainNavItems.map(item => {
                const { to, label, icon: Icon } = item
                const isActive = isNavItemActive(item, location.pathname)

                return (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                    >
                      <NavLink
                        to={to}
                        onClick={handleNavigate}
                      >
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
          {bottomNavItems.map(item => {
            const { to, label, icon: Icon } = item
            const isActive = isNavItemActive(item, location.pathname)

            return (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={label}
                >
                  <NavLink
                    to={to}
                    onClick={handleNavigate}
                  >
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
