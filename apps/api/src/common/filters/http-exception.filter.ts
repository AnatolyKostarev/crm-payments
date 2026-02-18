/// <reference path="../../types/fastify-cookie.d.ts" />
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FastifyReply } from 'fastify'
import { Prisma } from '@prisma/client'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.error('EXCEPTION:', exception)
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<FastifyReply>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Внутренняя ошибка сервера'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const response = exception.getResponse()
      if (typeof response === 'string') {
        message = response
      } else {
        const responseObj = response as any
        // Обработка ошибок валидации (массив сообщений)
        if (Array.isArray(responseObj.message)) {
          message = responseObj.message.join(', ')
        } else {
          message = responseObj.message || message
        }
      }
    }

    // Prisma errors
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT
          message = 'Запись уже существует'
          break
        case 'P2025':
          status = HttpStatus.NOT_FOUND
          message = 'Запись не найдена'
          break
        default:
          status = HttpStatus.BAD_REQUEST
          message = 'Ошибка базы данных'
      }
    }

    res.code(status).send({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    })
  }
}
