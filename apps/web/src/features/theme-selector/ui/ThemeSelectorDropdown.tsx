import { Check, Moon, Palette, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ThemePreset } from '@/shared/config/theme-presets'
import { useThemeSelector } from '../model/use-theme-selector'

function ThemePresetPreview({ preset }: { preset: ThemePreset }) {
  return (
    <div className="mt-1 flex items-center gap-1">
      <span
        className="h-2 w-6 rounded-sm border"
        style={{ backgroundColor: preset.preview.background }}
      />
      <span
        className="h-2 w-6 rounded-sm border"
        style={{ backgroundColor: preset.preview.card }}
      />
      <span
        className="h-2 w-6 rounded-sm border"
        style={{ backgroundColor: preset.preview.primary }}
      />
      <span
        className="h-2 w-6 rounded-sm border"
        style={{ backgroundColor: preset.preview.text }}
      />
    </div>
  )
}

export function ThemeSelectorDropdown() {
  const {
    resolvedTheme,
    themePresetId,
    setThemePreset,
    presetGroups,
    toggleTheme,
    toggleThemeLabel,
  } = useThemeSelector()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 sm:size-9"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="size-4 sm:size-5" />
          ) : (
            <Moon className="size-4 sm:size-5" />
          )}
          <span className="sr-only">Выбрать тему</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-72"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Palette className="size-4" />
          Темы оформления
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {presetGroups.map((group, groupIndex) => (
          <div key={group.key}>
            {groupIndex > 0 && <DropdownMenuSeparator />}
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              {group.label}
            </DropdownMenuLabel>
            {group.presets.map(preset => (
              <DropdownMenuItem
                key={preset.id}
                onClick={() => setThemePreset(preset.id)}
                className="flex items-center justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{preset.name}</p>
                  <ThemePresetPreview preset={preset} />
                </div>
                {themePresetId === preset.id && (
                  <Check className="size-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </div>
        ))}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={toggleTheme}>
          {toggleThemeLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
