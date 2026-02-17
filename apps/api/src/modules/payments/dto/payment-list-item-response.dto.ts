import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class ContractorRefDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
  @ApiProperty() inn!: string
}

class AuthorRefDto {
  @ApiProperty() id!: string
  @ApiProperty() name!: string
}

class CountRefDto {
  @ApiProperty() attachments!: number
  @ApiProperty() approvals!: number
}

export class PaymentListItemResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  number!: number

  @ApiProperty()
  amount!: number

  @ApiProperty()
  currency!: string

  @ApiProperty()
  purpose!: string

  @ApiPropertyOptional()
  dueDate?: string | null

  @ApiProperty({ enum: ['DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'REVISION', 'IN_REGISTRY', 'PAID'] })
  status!: string

  @ApiProperty()
  authorId!: string

  @ApiProperty()
  contractorId!: string

  @ApiPropertyOptional()
  contractId?: string | null

  @ApiProperty()
  tenantId!: string

  @ApiProperty()
  createdAt!: string

  @ApiProperty()
  updatedAt!: string

  @ApiProperty({ type: ContractorRefDto })
  contractor!: ContractorRefDto

  @ApiProperty({ type: AuthorRefDto })
  author!: AuthorRefDto

  @ApiProperty({ type: CountRefDto })
  _count!: CountRefDto
}
