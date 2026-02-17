import { create } from 'zustand'
import type { User, Tenant } from './types'

interface SessionState {
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

export const useSessionStore = create<SessionState>((set, get) => ({
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
