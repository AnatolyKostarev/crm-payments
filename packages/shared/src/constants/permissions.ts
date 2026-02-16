export const Permission = {
  // Заявки
  PAYMENT_CREATE: 'PAYMENT_CREATE',
  PAYMENT_EDIT_OWN: 'PAYMENT_EDIT_OWN',
  PAYMENT_VIEW_OWN: 'PAYMENT_VIEW_OWN',
  PAYMENT_VIEW_ALL: 'PAYMENT_VIEW_ALL',

  // Согласование
  APPROVAL_DECIDE: 'APPROVAL_DECIDE',
  APPROVAL_ROUTE_MANAGE: 'APPROVAL_ROUTE_MANAGE',

  // Реестр
  REGISTRY_CREATE: 'REGISTRY_CREATE',
  REGISTRY_EXPORT: 'REGISTRY_EXPORT',
  REGISTRY_MARK_PAID: 'REGISTRY_MARK_PAID',

  // Контрагенты
  CONTRACTOR_MANAGE: 'CONTRACTOR_MANAGE',

  // Администрирование
  ADMIN_USERS: 'ADMIN_USERS',
  ADMIN_ROLES: 'ADMIN_ROLES',
  ADMIN_TENANT: 'ADMIN_TENANT',
} as const

export type PermissionKey = keyof typeof Permission
export type PermissionValue = (typeof Permission)[PermissionKey]
