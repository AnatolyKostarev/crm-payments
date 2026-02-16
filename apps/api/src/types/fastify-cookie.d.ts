declare module 'fastify' {
  interface FastifyReply {
    code(statusCode: number): FastifyReply
    status(statusCode: number): FastifyReply
    send(payload?: unknown): FastifyReply
    setCookie(
      name: string,
      value: string,
      options?: {
        domain?: string
        expires?: Date
        httpOnly?: boolean
        maxAge?: number
        path?: string
        sameSite?: boolean | 'lax' | 'strict' | 'none'
        secure?: boolean
        signed?: boolean
      }
    ): FastifyReply
    clearCookie(name: string, options?: { path?: string; domain?: string }): FastifyReply
  }

  interface FastifyRequest {
    cookies: {
      [key: string]: string | undefined
    }
  }
}
