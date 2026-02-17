import { api } from './client'

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  companyName: string
  email: string
  password: string
  name: string
}

interface AuthResponse {
  data: {
    user: {
      id: string
      email: string
      name: string
      tenantId: string
      isActive: boolean
      telegramChatId: string | null
    }
    tenant: {
      id: string
      name: string
    }
    permissions: string[]
    accessToken: string
  }
}

export const authApi = {
  login: (data: LoginRequest) =>
    api.post('auth/login', { json: data }).json<AuthResponse>(),

  register: (data: RegisterRequest) =>
    api.post('auth/register', { json: data }).json<AuthResponse>(),

  refresh: () => api.post('auth/refresh').json<AuthResponse>(),

  logout: () => api.post('auth/logout').json(),

  me: () => api.get('auth/me').json<AuthResponse>(),
}
