import {
  IsString,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
  MaxLength,
  IsDateString,
} from 'class-validator'

export class CreatePaymentDto {
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  amount!: number

  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string

  @IsString()
  @MaxLength(500)
  purpose!: string

  @IsOptional()
  @IsDateString()
  dueDate?: string

  @IsUUID()
  contractorId!: string

  @IsOptional()
  @IsUUID()
  contractId?: string
}
