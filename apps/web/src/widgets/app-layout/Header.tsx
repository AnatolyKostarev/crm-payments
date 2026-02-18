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
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background px-3 sm:px-4 md:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
        <SidebarTrigger className="-ml-1 size-8 shrink-0 sm:size-9" />
        <Separator orientation="vertical" className="mr-2 h-6 shrink-0" decorative />
        <span className="truncate text-sm text-muted-foreground">
          {tenant?.name}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <ThemeToggle />
        <Separator
          orientation="vertical"
          className="h-6 shrink-0 hidden sm:block"
          decorative
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative size-8 shrink-0 sm:size-9"
            >
              <Bell className="size-4 sm:size-5" />
              <Badge
                variant="destructive"
                className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px]"
              >
                0
              </Badge>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Уведомления</TooltipContent>
        </Tooltip>
        <Separator
          orientation="vertical"
          className="h-6 shrink-0 hidden sm:block"
          decorative
        />
        <UserMenu />
      </div>
    </header>
  )
}
