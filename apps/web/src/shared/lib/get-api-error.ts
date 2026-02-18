import { HTTPError, TimeoutError } from 'ky'

export async function getApiError(error: unknown, fallback: string): Promise<string> {
  if (error instanceof TimeoutError) {
    return 'Сервер не отвечает. Попробуйте позже.'
  }

  if (error instanceof HTTPError) {
    const { status } = error.response

    if (status >= 500) {
      return 'Ошибка сервера. Попробуйте позже.'
    }

    // Пытаемся извлечь сообщение об ошибке из ответа
    try {
      const body = await error.response.json() as { message?: string | string[] }
      if (body?.message) {
        if (Array.isArray(body.message)) {
          return body.message.join(', ')
        }
        return body.message
      }
    } catch {
      // Если не удалось распарсить JSON, используем fallback
    }
  }

  return fallback
}
