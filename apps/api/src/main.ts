import { NestFactory } from '@nestjs/core'
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { ValidationPipe } from '@nestjs/common'
import fastifyCookie from '@fastify/cookie'
import { AppModule } from './app.module'
import { AllExceptionsFilter } from './common/filters/http-exception.filter'
import { TransformInterceptor } from './common/interceptors/transform.interceptor'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  )

  // Cookies (для refresh token)
  await app.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'cookie-secret',
  })

  // CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // Global prefix
  app.setGlobalPrefix('api')

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  )

  // Exception filter
  app.useGlobalFilters(new AllExceptionsFilter())

  // Response transform
  app.useGlobalInterceptors(new TransformInterceptor())

  const port = process.env.PORT || 4000

  const swaggerConfig = new DocumentBuilder()
    .setTitle('CRM Payments API')
    .setDescription('API для согласования платежей контрагентам')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swaggerConfig)
  SwaggerModule.setup('docs', app, document)

  await app.listen(port, '0.0.0.0')
  console.log(`🚀 API running on http://localhost:${port}/api`)
}

bootstrap()
