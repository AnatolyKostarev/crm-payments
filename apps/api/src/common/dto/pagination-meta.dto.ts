import { ApiProperty } from '@nestjs/swagger'

export class PaginationMetaDto {
  @ApiProperty({ example: 99, description: 'Всего записей' })
  total!: number

  @ApiProperty({ example: 21, description: 'Лимит на страницу' })
  limit!: number

  @ApiProperty({ example: 0, description: 'Смещение' })
  offset!: number

  @ApiProperty({ example: true, description: 'Есть ли ещё страницы' })
  hasMore!: boolean
}
