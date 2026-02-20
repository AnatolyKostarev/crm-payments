import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PageLoadingStateProps {
  className?: string
}

interface PageNotFoundStateProps {
  message?: string
  onBack?: () => void
  className?: string
}

export function PageLoadingState({ className }: PageLoadingStateProps) {
  return (
    <div className={className || 'flex items-center justify-center py-12'}>
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  )
}

export function PageNotFoundState({
  message = 'Ничего не найдено',
  onBack,
  className,
}: PageNotFoundStateProps) {
  return (
    <div className={className || 'space-y-4'}>
      {onBack && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      <div className="py-12 text-center text-muted-foreground">
        {message}
      </div>
    </div>
  )
}
