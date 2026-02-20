import type { ColumnSettingsItem } from '@/shared/ui/ColumnSettingsDialog'

export const PAYMENTS_COLUMN_SIZING_STORAGE_KEY = 'table-column-sizing:payments'
export const PAYMENTS_COLUMN_PREFERENCES_STORAGE_KEY =
  'table-column-preferences:payments'
export const PAYMENTS_MIN_COLUMN_SIZE = 96

export const PAYMENTS_CONFIGURABLE_COLUMNS: ColumnSettingsItem[] = [
  { id: 'number', label: '№' },
  { id: 'contractor', label: 'Контрагент' },
  { id: 'purpose', label: 'Назначение платежа' },
  { id: 'amount', label: 'Сумма' },
  { id: 'status', label: 'Статус' },
  { id: 'author', label: 'Автор' },
  { id: 'createdAt', label: 'Дата' },
  { id: 'dueDate', label: 'Срок оплаты' },
]

export const PAYMENTS_CONFIGURABLE_COLUMN_IDS = PAYMENTS_CONFIGURABLE_COLUMNS.map(
  column => column.id
)
