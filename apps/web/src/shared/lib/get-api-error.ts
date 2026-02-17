import { HTTPError, TimeoutError } from 'ky'

export function getApiError(error: unknown, fallback: string): string {
  if (error instanceof TimeoutError) {
    return 'Сервер не отвечает. Попробуйте позже.'
  }

  if (error instanceof HTTPError) {
    const { status } = error.response

    if (status >= 500) {
      return 'Ошибка сервера. Попробуйте позже.'
    }
  }

  return fallback
}
