import { useMemo } from 'react'
import {
  getThemePresetsByMode,
  type ThemePreset,
} from '@/shared/config/theme-presets'
import { useTheme } from '@/shared/hooks/use-theme'

export interface ThemePresetGroup {
  key: 'light' | 'dark'
  label: string
  presets: ThemePreset[]
}

export function useThemeSelector() {
  const { resolvedTheme, themePresetId, setThemePreset, setTheme } = useTheme()

  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'
  const toggleThemeLabel =
    nextTheme === 'dark'
      ? 'Переключить на тёмную тему'
      : 'Переключить на светлую тему'

  const presetGroups = useMemo<ThemePresetGroup[]>(
    () => [
      {
        key: 'light',
        label: 'Светлые темы',
        presets: getThemePresetsByMode('light'),
      },
      {
        key: 'dark',
        label: 'Тёмные темы',
        presets: getThemePresetsByMode('dark'),
      },
    ],
    []
  )

  const toggleTheme = () => setTheme(nextTheme)

  return {
    resolvedTheme,
    themePresetId,
    setThemePreset,
    presetGroups,
    toggleTheme,
    toggleThemeLabel,
  }
}
