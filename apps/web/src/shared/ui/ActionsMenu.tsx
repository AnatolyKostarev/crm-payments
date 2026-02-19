import { MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export interface ActionItem {
  label: string
  icon?: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'default' | 'destructive'
  separator?: boolean // Добавить разделитель перед этим элементом
}

export interface ActionsMenuProps {
  actions: ActionItem[]
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'right' | 'bottom' | 'left'
  triggerClassName?: string
}

export function ActionsMenu({
  actions,
  align = 'end',
  side = 'bottom',
  triggerClassName,
}: ActionsMenuProps) {
  if (actions.length === 0) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn('h-8 w-8', triggerClassName)}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">Открыть меню действий</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} side={side}>
        {actions.map((action, index) => (
          <div key={index}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              onClick={action.onClick}
              disabled={action.disabled}
              variant={action.variant || 'default'}
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
