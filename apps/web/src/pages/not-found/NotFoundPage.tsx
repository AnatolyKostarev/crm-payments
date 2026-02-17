import { Link } from 'react-router'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotFoundPageProps {
  fullScreen?: boolean
}

export function NotFoundPage({ fullScreen = true }: NotFoundPageProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center bg-background px-4 text-center ${
        fullScreen ? 'min-h-screen' : 'min-h-[60vh]'
      }`}
    >
      <div className="space-y-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          <FileQuestion className="h-10 w-10 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">404</h1>
          <p className="text-lg text-muted-foreground">
            Страница не найдена
          </p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Запрашиваемая страница не существует или была удалена.
          </p>
        </div>
        <Button asChild>
          <Link to="/">Вернуться на главную</Link>
        </Button>
      </div>
    </div>
  )
}
