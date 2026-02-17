import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator'

export class CreateContractorDto {
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name!: string

  @IsString()
  @MinLength(10)
  @MaxLength(12)
  inn!: string

  @IsOptional()
  @IsString()
  @MaxLength(9)
  kpp?: string

  @IsOptional()
  @IsString()
  @MaxLength(200)
  bankName?: string

  @IsOptional()
  @IsString()
  @MaxLength(9)
  bik?: string

  @IsOptional()
  @IsString()
  @MaxLength(20)
  account?: string
}
