import { IsOptional, IsString, IsEnum, IsDateString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaymentStatus } from '@prisma/client'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryPaymentDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PaymentStatus, description: 'Фильтр по статусу' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus

  @ApiPropertyOptional({ description: 'Фильтр по ID контрагента' })
  @IsOptional()
  @IsString()
  contractorId?: string

  @ApiPropertyOptional({ description: 'Дата от (ISO 8601)', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string

  @ApiPropertyOptional({ description: 'Дата до (ISO 8601)', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  dateTo?: string
}
