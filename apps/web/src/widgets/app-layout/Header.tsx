import { Bell } from 'lucide-react'
import { useSessionStore } from '@/entities/session'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/app/providers/theme-toggle'
import { UserMenu } from '@/widgets/header/UserMenu'

export function Header() {
  const { tenant } = useSessionStore()

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
        <UserMenu />
      </div>
    </header>
  )
}
