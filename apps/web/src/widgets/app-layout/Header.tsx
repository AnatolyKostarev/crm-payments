import { useState } from 'react'
import { LogOut, Bell } from 'lucide-react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/shared/stores/auth.store'
import { authApi } from '@/shared/api/auth.api'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ConfirmDialog } from '@/shared/ui/confirm-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/app/providers/theme-toggle'

export function Header() {
  const { user, tenant, logout } = useAuthStore()
  const navigate = useNavigate()
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } finally {
      logout()
      navigate('/login')
    }
  }

  const initials = user?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-3 sm:px-4 md:px-6">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />

        <span className="text-xs sm:text-sm text-muted-foreground truncate">
          {tenant?.name}
        </span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {/* Theme toggle */}
        <ThemeToggle />

        <Separator
          orientation="vertical"
          className="h-5 sm:h-6 hidden sm:block"
        />

        {/* Notifications */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative h-8 w-8 sm:h-9 sm:w-9"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <Badge
                variant="destructive"
                className="absolute -right-0.5 -top-0.5 h-4 w-4 rounded-full p-0 text-[10px] flex items-center justify-center"
              >
                0
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Уведомления</TooltipContent>
        </Tooltip>

        <Separator
          orientation="vertical"
          className="h-5 sm:h-6 hidden sm:block"
        />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-1.5 sm:gap-2 px-1.5 sm:px-2 h-8 sm:h-9"
            >
              <Avatar className="h-6 w-6 sm:h-7 sm:w-7 shrink-0">
                <AvatarFallback className="bg-primary/10 text-xs text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-xs sm:text-sm font-medium lg:inline-block truncate max-w-[120px]">
                {user?.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 sm:w-56"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setLogoutDialogOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ConfirmDialog
          open={logoutDialogOpen}
          onOpenChange={setLogoutDialogOpen}
          title="Выход из системы"
          description="Вы уверены, что хотите выйти из аккаунта?"
          confirmLabel="Выйти"
          variant="destructive"
          onConfirm={handleLogout}
        />
      </div>
    </header>
  )
}
