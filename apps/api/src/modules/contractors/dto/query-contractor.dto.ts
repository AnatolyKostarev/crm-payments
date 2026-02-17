import { IsOptional, IsString } from 'class-validator'
import { ApiPropertyOptional } from '@nestjs/swagger'
import { PaginationDto } from '../../../common/dto/pagination.dto'

export class QueryContractorDto extends PaginationDto {
  @ApiPropertyOptional({ description: 'Поиск по названию или ИНН' })
  @IsOptional()
  @IsString()
  search?: string
}
