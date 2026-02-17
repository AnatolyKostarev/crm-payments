import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  tenantId: string
  isActive: boolean
  telegramChatId: string | null
}

interface Tenant {
  id: string
  name: string
}

interface AuthState {
  user: User | null
  tenant: Tenant | null
  permissions: string[]
  accessToken: string | null
  isAuthenticated: boolean

  setAuth: (data: {
    user: User
    tenant: Tenant
    permissions: string[]
    accessToken: string
  }) => void
  setAccessToken: (token: string) => void
  logout: () => void
  hasPermission: (permission: string) => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  tenant: null,
  permissions: [],
  accessToken: null,
  isAuthenticated: false,

  setAuth: ({ user, tenant, permissions, accessToken }) =>
    set({
      user,
      tenant,
      permissions,
      accessToken,
      isAuthenticated: true,
    }),

  setAccessToken: token => set({ accessToken: token }),

  logout: () =>
    set({
      user: null,
      tenant: null,
      permissions: [],
      accessToken: null,
      isAuthenticated: false,
    }),

  hasPermission: permission => get().permissions.includes(permission),
}))
