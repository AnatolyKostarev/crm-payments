import {
  IsOptional,
  IsString,
  IsEnum,
  IsDateString,
  ValidateIf,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions,
} from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaymentStatus } from '@prisma/client'
import { PaginationDto } from '../../../common/dto/pagination.dto'

@ValidatorConstraint({ name: 'isDateRangeValid', async: false })
export class IsDateRangeValidConstraint implements ValidatorConstraintInterface {
  validate(dateTo: string, args: ValidationArguments) {
    const obj = args.object as { dateFrom?: string; dateTo?: string }
    if (!dateTo || !obj.dateFrom) {
      return true // Если одна из дат отсутствует, валидация проходит
    }
    const fromDate = new Date(obj.dateFrom)
    const toDate = new Date(dateTo)
    return toDate >= fromDate
  }

  defaultMessage(args: ValidationArguments) {
    return 'Дата окончания не может быть ранее даты начала'
  }
}

export function IsDateRangeValid(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsDateRangeValidConstraint,
    })
  }
}

export class QueryPaymentDto extends PaginationDto {
  @ApiPropertyOptional({ enum: PaymentStatus, description: 'Фильтр по статусу' })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus

  @ApiPropertyOptional({ description: 'Фильтр по ID контрагента' })
  @IsOptional()
  @IsString()
  contractorId?: string

  @ApiPropertyOptional({
    description: 'Фильтр по нескольким ID контрагентов (через запятую)',
    example: 'id1,id2,id3',
  })
  @IsOptional()
  @IsString()
  contractorIds?: string

  @ApiPropertyOptional({ description: 'Дата от (ISO 8601)', example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string

  @ApiPropertyOptional({ description: 'Дата до (ISO 8601)', example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  @ValidateIf((o) => o.dateFrom && o.dateTo)
  @IsDateRangeValid({ message: 'Дата окончания не может быть ранее даты начала' })
  dateTo?: string
}
