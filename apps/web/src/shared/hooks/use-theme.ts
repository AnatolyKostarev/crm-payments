import { useEffect, useMemo, useState } from 'react'
import {
  DEFAULT_PRESET_BY_MODE,
  getThemePresetById,
  THEME_PRESETS,
  type ThemeMode,
} from '@/shared/config/theme-presets'

type Theme = 'light' | 'dark' | 'system'
type PresetByMode = Record<ThemeMode, string>

const THEME_STORAGE_KEY = 'theme'
const THEME_PRESET_STORAGE_KEY = 'theme_preset'
const THEME_PRESET_BY_MODE_STORAGE_KEY = 'theme_preset_by_mode'

function readPresetByModeStorage(): PresetByMode {
  if (typeof window === 'undefined') return { ...DEFAULT_PRESET_BY_MODE }

  try {
    const raw = localStorage.getItem(THEME_PRESET_BY_MODE_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PRESET_BY_MODE }

    const parsed = JSON.parse(raw) as Partial<PresetByMode>
    const safeLight = parsed.light ?? DEFAULT_PRESET_BY_MODE.light
    const safeDark = parsed.dark ?? DEFAULT_PRESET_BY_MODE.dark

    return {
      light: getThemePresetById(safeLight)?.mode === 'light'
        ? safeLight
        : DEFAULT_PRESET_BY_MODE.light,
      dark: getThemePresetById(safeDark)?.mode === 'dark'
        ? safeDark
        : DEFAULT_PRESET_BY_MODE.dark,
    }
  } catch {
    return { ...DEFAULT_PRESET_BY_MODE }
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'system'
    const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
    return stored || 'system'
  })
  const [themePresetId, setThemePresetId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(THEME_PRESET_STORAGE_KEY)
  })
  const [presetByMode, setPresetByMode] = useState<PresetByMode>(() =>
    readPresetByModeStorage()
  )

  const [systemTheme, setSystemTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  const resolvedTheme = useMemo<'light' | 'dark'>(() => {
    if (theme === 'system') return systemTheme
    return theme
  }, [theme, systemTheme])
  const resolvedPresetId = useMemo(() => {
    const explicitPreset = getThemePresetById(themePresetId)
    if (explicitPreset?.mode === resolvedTheme) {
      return explicitPreset.id
    }

    const modePreset = getThemePresetById(presetByMode[resolvedTheme])
    if (modePreset?.mode === resolvedTheme) {
      return modePreset.id
    }

    return DEFAULT_PRESET_BY_MODE[resolvedTheme]
  }, [themePresetId, presetByMode, resolvedTheme])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    root.dataset.theme = resolvedPresetId
  }, [resolvedTheme, resolvedPresetId])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => {
      setSystemTheme(mediaQuery.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem(THEME_STORAGE_KEY, newTheme)
  }

  const setThemePreset = (presetId: string) => {
    const preset = getThemePresetById(presetId)
    if (!preset) return

    setThemePresetId(preset.id)
    setTheme(preset.mode)
    localStorage.setItem(THEME_PRESET_STORAGE_KEY, preset.id)
    localStorage.setItem(THEME_STORAGE_KEY, preset.mode)

    const nextPresetByMode = {
      ...presetByMode,
      [preset.mode]: preset.id,
    }
    setPresetByMode(nextPresetByMode)
    localStorage.setItem(
      THEME_PRESET_BY_MODE_STORAGE_KEY,
      JSON.stringify(nextPresetByMode)
    )
  }

  return {
    theme,
    setTheme: setThemeValue,
    resolvedTheme,
    themePresetId: resolvedPresetId,
    setThemePreset,
    presets: THEME_PRESETS,
  }
}
