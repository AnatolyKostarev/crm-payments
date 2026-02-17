import { ApiProperty } from '@nestjs/swagger'
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto'
import { PaymentListItemResponseDto } from './payment-list-item-response.dto'

export class PaginatedPaymentsResponseDto {
  @ApiProperty({ type: [PaymentListItemResponseDto], description: 'Список заявок' })
  items!: PaymentListItemResponseDto[]

  @ApiProperty({ type: PaginationMetaDto, description: 'Метаданные пагинации' })
  pagination!: PaginationMetaDto
}
