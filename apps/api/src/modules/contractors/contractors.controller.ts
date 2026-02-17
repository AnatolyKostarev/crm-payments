import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger'
import { ContractorsService } from './contractors.service'
import { CreateContractorDto } from './dto/create-contractor.dto'
import { UpdateContractorDto } from './dto/update-contractor.dto'
import { QueryContractorDto } from './dto/query-contractor.dto'
import { ContractorResponseDto } from './dto/contractor-response.dto'
import { PaginatedContractorsResponseDto } from './dto/paginated-contractors-response.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@ApiTags('Contractors')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('contractors')
export class ContractorsController {
  constructor(private contractorsService: ContractorsService) {}

  @Post()
  @RequirePermissions('CONTRACTOR_MANAGE')
  @ApiOperation({ summary: 'Создание контрагента' })
  create(
    @Body() dto: CreateContractorDto,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.contractorsService.create(dto, tenantId)
  }

  @Get()
  @ApiOperation({ summary: 'Список контрагентов' })
  @ApiOkResponse({ description: 'Пагинированный список контрагентов', type: PaginatedContractorsResponseDto })
  findAll(
    @Query() query: QueryContractorDto,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.contractorsService.findAll(query, tenantId)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Контрагент по ID' })
  @ApiOkResponse({ description: 'Контрагент', type: ContractorResponseDto })
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.contractorsService.findOne(id, tenantId)
  }

  @Patch(':id')
  @RequirePermissions('CONTRACTOR_MANAGE')
  @ApiOperation({ summary: 'Обновление контрагента' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateContractorDto,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.contractorsService.update(id, dto, tenantId)
  }

  @Delete(':id')
  @RequirePermissions('CONTRACTOR_MANAGE')
  @ApiOperation({ summary: 'Удаление контрагента (soft delete)' })
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.contractorsService.remove(id, tenantId)
  }
}
