import { ApiProperty } from '@nestjs/swagger'
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto'
import { ContractorResponseDto } from './contractor-response.dto'

export class PaginatedContractorsResponseDto {
  @ApiProperty({ type: [ContractorResponseDto], description: 'Список контрагентов' })
  items!: ContractorResponseDto[]

  @ApiProperty({ type: PaginationMetaDto, description: 'Метаданные пагинации' })
  pagination!: PaginationMetaDto
}
