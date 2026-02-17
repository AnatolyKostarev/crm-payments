import { api } from '@/shared/api/client'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../model/types'

export const sessionApi = {
  login: (data: LoginRequest) =>
    api.post('auth/login', { json: data }).json<AuthResponse>(),

  register: (data: RegisterRequest) =>
    api.post('auth/register', { json: data }).json<AuthResponse>(),

  refresh: () => api.post('auth/refresh').json<AuthResponse>(),

  logout: () => api.post('auth/logout').json(),

  me: () => api.get('auth/me').json<AuthResponse>(),
}
