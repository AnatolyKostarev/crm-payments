import { IsOptional, IsInt, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiPropertyOptional } from '@nestjs/swagger'

export class PaginationDto {
  @ApiPropertyOptional({ default: 21, description: 'Количество на странице' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 21

  @ApiPropertyOptional({ default: 0, description: 'Смещение (offset)' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0
}
