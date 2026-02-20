import type { ColumnSettingsItem } from '@/shared/ui/ColumnSettingsDialog'

export const CONTRACTORS_COLUMN_SIZING_STORAGE_KEY =
  'table-column-sizing:contractors'
export const CONTRACTORS_COLUMN_PREFERENCES_STORAGE_KEY =
  'table-column-preferences:contractors'
export const CONTRACTORS_MIN_COLUMN_SIZE = 96

export const CONTRACTORS_CONFIGURABLE_COLUMNS: ColumnSettingsItem[] = [
  { id: 'name', label: 'Название' },
  { id: 'inn', label: 'ИНН' },
  { id: 'bankName', label: 'Банк' },
  { id: 'account', label: 'Расчётный счёт' },
]

export const CONTRACTORS_CONFIGURABLE_COLUMN_IDS =
  CONTRACTORS_CONFIGURABLE_COLUMNS.map(column => column.id)
