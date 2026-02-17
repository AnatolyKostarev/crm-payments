export interface User {
  id: string
  email: string
  name: string
  tenantId: string
  isActive: boolean
  telegramChatId: string | null
}

export interface Tenant {
  id: string
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  companyName: string
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  data: {
    user: User
    tenant: Tenant
    permissions: string[]
    accessToken: string
  }
}
