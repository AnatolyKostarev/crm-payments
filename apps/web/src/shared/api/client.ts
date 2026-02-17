import ky from 'ky'
import { useSessionStore } from '@/entities/session'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

export const api = ky.create({
  prefixUrl: API_URL,
  credentials: 'include', // для httpOnly cookie (refresh token)
  timeout: 30000,
  hooks: {
    beforeRequest: [
      request => {
        const token = useSessionStore.getState().accessToken
        if (token) {
          request.headers.set('Authorization', `Bearer ${token}`)
        }
      },
    ],
    afterResponse: [
      async (request, options, response) => {
        // Если 401 — пробуем refresh
        if (response.status === 401 && !request.url.includes('/auth/refresh')) {
          try {
            const refreshRes = await ky
              .post(`${API_URL}/auth/refresh`, { credentials: 'include' })
              .json<{ data: { accessToken: string } }>()

            const newToken = refreshRes.data.accessToken
            useSessionStore.getState().setAccessToken(newToken)

            // Повторяем оригинальный запрос с новым токеном
            request.headers.set('Authorization', `Bearer ${newToken}`)
            return ky(request)
          } catch {
            useSessionStore.getState().logout()
            window.location.href = '/login'
          }
        }
      },
    ],
  },
})
