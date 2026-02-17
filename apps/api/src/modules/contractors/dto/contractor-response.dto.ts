import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class ContractorResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  name!: string

  @ApiProperty()
  inn!: string

  @ApiPropertyOptional()
  kpp?: string

  @ApiPropertyOptional()
  bankName?: string

  @ApiPropertyOptional()
  bik?: string

  @ApiPropertyOptional()
  account?: string

  @ApiProperty()
  tenantId!: string

  @ApiProperty()
  isActive!: boolean

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string
}
