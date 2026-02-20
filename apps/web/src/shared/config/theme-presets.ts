export type ThemeMode = 'light' | 'dark'

export interface ThemePresetPreview {
  background: string
  card: string
  primary: string
  text: string
}

export interface ThemePreset {
  id: string
  name: string
  description?: string
  mode: ThemeMode
  preview: ThemePresetPreview
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'light-gradient',
    name: 'Light Aurora',
    description: 'Light palette with subtle business gradient',
    mode: 'light',
    preview: {
      background: '#eef4ff',
      card: '#ffffff',
      primary: '#5b5af7',
      text: '#1f2a44',
    },
  },
  {
    id: 'light-vibrant-professional',
    name: 'Vibrant Professional Light',
    description: 'Business light with richer accent system',
    mode: 'light',
    preview: {
      background: '#f5f8ff',
      card: '#ffffff',
      primary: '#4f46e5',
      text: '#1f2a44',
    },
  },
  {
    id: 'light-soft',
    name: 'Soft Professional',
    description: 'Neutral light with soft blue tint',
    mode: 'light',
    preview: {
      background: '#f8fafc',
      card: '#ffffff',
      primary: '#4f46e5',
      text: '#1e293b',
    },
  },
  {
    id: 'light-paper',
    name: 'Paper Neutral',
    description: 'Warm paper-like light palette',
    mode: 'light',
    preview: {
      background: '#fafaf8',
      card: '#ffffff',
      primary: '#2563eb',
      text: '#1f2937',
    },
  },
  {
    id: 'light-ice',
    name: 'Ice Slate',
    description: 'Cool and crisp enterprise look',
    mode: 'light',
    preview: {
      background: '#f4f7fb',
      card: '#fcfdff',
      primary: '#0ea5e9',
      text: '#0f172a',
    },
  },
  {
    id: 'dark-gradient',
    name: 'Dark Aurora',
    description: 'Dark slate palette with controlled gradient depth',
    mode: 'dark',
    preview: {
      background: '#151c2e',
      card: '#212b42',
      primary: '#7e7dff',
      text: '#eaf0ff',
    },
  },
  {
    id: 'dark-vibrant-professional',
    name: 'Vibrant Professional Dark',
    description: 'Deep slate dark with richer but controlled accents',
    mode: 'dark',
    preview: {
      background: '#171d2b',
      card: '#222b3d',
      primary: '#7c86ff',
      text: '#e8edff',
    },
  },
  {
    id: 'dark-graphite',
    name: 'Graphite Blue',
    description: 'Balanced dark with calm indigo accent',
    mode: 'dark',
    preview: {
      background: '#202633',
      card: '#2a3241',
      primary: '#6366f1',
      text: '#e5e7eb',
    },
  },
  {
    id: 'dark-carbon',
    name: 'Carbon Neutral',
    description: 'Classic high-legibility dark palette',
    mode: 'dark',
    preview: {
      background: '#1f232b',
      card: '#2b303b',
      primary: '#3b82f6',
      text: '#e5e7eb',
    },
  },
  {
    id: 'dark-navy',
    name: 'Navy Contrast',
    description: 'Cool navy with stronger layered contrast',
    mode: 'dark',
    preview: {
      background: '#111827',
      card: '#1f2937',
      primary: '#22c55e',
      text: '#f3f4f6',
    },
  },
]

export const DEFAULT_PRESET_BY_MODE: Record<ThemeMode, string> = {
  light: 'light-vibrant-professional',
  dark: 'dark-vibrant-professional',
}

export function getThemePresetById(id: string | null | undefined) {
  if (!id) return null
  return THEME_PRESETS.find(preset => preset.id === id) ?? null
}

export function getThemePresetsByMode(mode: ThemeMode) {
  return THEME_PRESETS.filter(preset => preset.mode === mode)
}
