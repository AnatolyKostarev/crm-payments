import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface SearchInputProps
  extends Omit<
    React.ComponentProps<typeof Input>,
    'type'
  > {
  /** Максимальная ширина контейнера (Tailwind класс), по умолчанию max-w-sm */
  containerClassName?: string
}

export function SearchInput({
  className,
  containerClassName,
  ...inputProps
}: SearchInputProps) {
  return (
    <div
      className={cn(
        'relative flex-1',
        containerClassName ?? 'max-w-sm'
      )}
    >
      <Search
        className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none"
        aria-hidden
      />
      <Input
        type="search"
        autoComplete="off"
        className={cn('h-10 pl-9', className)}
        {...inputProps}
      />
    </div>
  )
}
