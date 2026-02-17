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
import { PaymentsService } from './payments.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { QueryPaymentDto } from './dto/query-payment.dto'
import { PaginatedPaymentsResponseDto } from './dto/paginated-payments-response.dto'
import { PaymentDetailResponseDto } from './dto/payment-detail-response.dto'
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard'
import { PermissionsGuard } from '../../common/guards/permissions.guard'
import { RequirePermissions } from '../../common/decorators/permissions.decorator'
import { CurrentUser } from '../../common/decorators/current-user.decorator'

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post()
  @RequirePermissions('PAYMENT_CREATE')
  @ApiOperation({ summary: 'Создание заявки на оплату' })
  create(
    @Body() dto: CreatePaymentDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.paymentsService.create(dto, userId, tenantId)
  }

  @Get()
  @ApiOperation({ summary: 'Список заявок (VIEW_ALL или свои)' })
  @ApiOkResponse({ description: 'Пагинированный список заявок', type: PaginatedPaymentsResponseDto })
  findAll(
    @Query() query: QueryPaymentDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('permissions') permissions: string[]
  ) {
    return this.paymentsService.findAll(query, userId, tenantId, permissions)
  }

  @Get(':id')
  @ApiOperation({ summary: 'Детали заявки' })
  @ApiOkResponse({ description: 'Заявка на оплату', type: PaymentDetailResponseDto })
  findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string,
    @CurrentUser('permissions') permissions: string[]
  ) {
    return this.paymentsService.findOne(id, userId, tenantId, permissions)
  }

  @Patch(':id')
  @RequirePermissions('PAYMENT_EDIT_OWN')
  @ApiOperation({ summary: 'Обновление заявки (только DRAFT/REVISION)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePaymentDto,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.paymentsService.update(id, dto, userId, tenantId)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление заявки (только DRAFT)' })
  remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.paymentsService.remove(id, userId, tenantId)
  }

  @Post(':id/submit')
  @RequirePermissions('PAYMENT_CREATE')
  @ApiOperation({ summary: 'Отправить на согласование' })
  submit(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('tenantId') tenantId: string
  ) {
    return this.paymentsService.submit(id, userId, tenantId)
  }
}
