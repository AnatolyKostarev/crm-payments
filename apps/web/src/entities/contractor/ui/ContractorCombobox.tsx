import { useState } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useContractors } from '@/entities/contractor/hooks'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

interface ContractorComboboxProps {
  value: string
  onChange: (value: string) => void
}

export function ContractorCombobox({
  value,
  onChange,
}: ContractorComboboxProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const { data } = useContractors({ search: search || undefined, limit: 20 })
  const items = data?.data?.items ?? []

  const selected = items.find(c => c.id === value)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal"
        >
          {selected ? (
            <span>
              {selected.name}{' '}
              <span className="text-muted-foreground">({selected.inn})</span>
            </span>
          ) : (
            <span className="text-muted-foreground">
              Выберите контрагента...
            </span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[400px] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Поиск по названию или ИНН..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>Контрагенты не найдены</CommandEmpty>
            <CommandGroup>
              {items.map(c => (
                <CommandItem
                  key={c.id}
                  value={c.id}
                  onSelect={() => {
                    onChange(c.id)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === c.id ? 'opacity-100' : 'opacity-0'
                    }`}
                  />
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ИНН: {c.inn}
                    </p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
