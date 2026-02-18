import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/shared/hooks/use-theme'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="size-8 shrink-0 sm:size-9"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="size-4 sm:size-5" />
          ) : (
            <Moon className="size-4 sm:size-5" />
          )}
          <span className="sr-only">Переключить тему</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {resolvedTheme === 'dark' ? 'Светлая тема' : 'Темная тема'}
      </TooltipContent>
    </Tooltip>
  )
}
