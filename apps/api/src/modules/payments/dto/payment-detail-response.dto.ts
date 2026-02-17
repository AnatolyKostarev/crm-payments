import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PaymentDetailResponseDto {
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

  @ApiProperty({ description: 'Контрагент (объект)' })
  contractor!: object

  @ApiPropertyOptional({ description: 'Контракт (объект или null)' })
  contract?: object | null

  @ApiProperty({ description: 'Автор заявки' })
  author!: object

  @ApiProperty({ type: [Object], description: 'Вложения' })
  attachments!: object[]

  @ApiProperty({ type: [Object], description: 'Согласования' })
  approvals!: object[]
}
