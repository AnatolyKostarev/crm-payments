import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './prisma/prisma.module'
import { HealthController } from './health.controller'
import { AuthModule } from './modules/auth/auth.module'
import { ContractorsModule } from './modules/contractors/contractors.module'
import { PaymentsModule } from './modules/payments/payments.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ContractorsModule,
    PaymentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
