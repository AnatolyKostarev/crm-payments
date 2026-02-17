import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common'
import { PaymentStatus } from '@prisma/client'
import { PrismaService } from '../../prisma/prisma.service'
import { CreatePaymentDto } from './dto/create-payment.dto'
import { UpdatePaymentDto } from './dto/update-payment.dto'
import { QueryPaymentDto } from './dto/query-payment.dto'
import { paginatedResponse } from '../../common/helpers/pagination.helper'

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto, authorId: string, tenantId: string) {
    // Проверяем контрагента
    const contractor = await this.prisma.contractor.findFirst({
      where: { id: dto.contractorId, tenantId, isActive: true },
    })
    if (!contractor) throw new NotFoundException('Контрагент не найден')

    // Проверяем контракт, если указан
    if (dto.contractId) {
      const contract = await this.prisma.contract.findFirst({
        where: { id: dto.contractId, tenantId },
      })
      if (!contract) throw new NotFoundException('Контракт не найден')
    }

    const lastPayment = await this.prisma.paymentRequest.findFirst({
      where: { tenantId },
      orderBy: { number: 'desc' },
      select: { number: true },
    })
    const nextNumber = (lastPayment?.number ?? 0) + 1

    return this.prisma.paymentRequest.create({
      data: {
        number: nextNumber,
        amount: dto.amount,
        currency: dto.currency || 'RUB',
        purpose: dto.purpose,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        authorId,
        contractorId: dto.contractorId,
        contractId: dto.contractId || null,
        tenantId,
      },
      include: {
        contractor: true,
        author: { select: { id: true, name: true, email: true } },
      },
    })
  }

  async findAll(
    query: QueryPaymentDto,
    userId: string,
    tenantId: string,
    permissions: string[],
  ) {
    const { status, contractorId, dateFrom, dateTo, limit = 21, offset = 0 } = query

    const where: any = { tenantId }

    // VIEW_ALL видит все заявки, VIEW_OWN — только свои
    if (!permissions.includes('PAYMENT_VIEW_ALL')) {
      where.authorId = userId
    }

    if (status) where.status = status
    if (contractorId) where.contractorId = contractorId
    if (dateFrom || dateTo) {
      where.createdAt = {}
      if (dateFrom) where.createdAt.gte = new Date(dateFrom)
      if (dateTo) where.createdAt.lte = new Date(dateTo)
    }

    const [items, total] = await Promise.all([
      this.prisma.paymentRequest.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          contractor: { select: { id: true, name: true, inn: true } },
          author: { select: { id: true, name: true } },
          _count: { select: { attachments: true, approvals: true } },
        },
      }),
      this.prisma.paymentRequest.count({ where }),
    ])

    return paginatedResponse(items, total, limit, offset)
  }

  async findOne(
    id: string,
    userId: string,
    tenantId: string,
    permissions: string[],
  ) {
    const payment = await this.prisma.paymentRequest.findFirst({
      where: { id, tenantId },
      include: {
        contractor: true,
        contract: true,
        author: { select: { id: true, name: true, email: true } },
        attachments: true,
        approvals: {
          orderBy: { stepOrder: 'asc' },
          include: {
            approver: { select: { id: true, name: true } },
          },
        },
      },
    })

    if (!payment) throw new NotFoundException('Заявка не найдена')

    // Проверка доступа
    if (
      !permissions.includes('PAYMENT_VIEW_ALL') &&
      payment.authorId !== userId
    ) {
      throw new ForbiddenException('Нет доступа к этой заявке')
    }

    return payment
  }

  async update(
    id: string,
    dto: UpdatePaymentDto,
    userId: string,
    tenantId: string,
  ) {
    const payment = await this.prisma.paymentRequest.findFirst({
      where: { id, tenantId },
    })

    if (!payment) throw new NotFoundException('Заявка не найдена')
    if (payment.authorId !== userId) {
      throw new ForbiddenException('Можно редактировать только свои заявки')
    }
    if (payment.status !== 'DRAFT' && payment.status !== 'REVISION') {
      throw new BadRequestException(
        'Можно редактировать только черновики и заявки на доработке',
      )
    }

    return this.prisma.paymentRequest.update({
      where: { id },
      data: {
        ...(dto.amount !== undefined && { amount: dto.amount }),
        ...(dto.purpose !== undefined && { purpose: dto.purpose }),
        ...(dto.dueDate !== undefined && {
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
        }),
        ...(dto.contractorId !== undefined && {
          contractorId: dto.contractorId,
        }),
        ...(dto.contractId !== undefined && {
          contractId: dto.contractId || null,
        }),
        // При редактировании из REVISION — возвращаем в DRAFT
        ...(payment.status === 'REVISION' && { status: 'DRAFT' as PaymentStatus }),
      },
      include: {
        contractor: true,
        author: { select: { id: true, name: true, email: true } },
      },
    })
  }

  async remove(id: string, userId: string, tenantId: string) {
    const payment = await this.prisma.paymentRequest.findFirst({
      where: { id, tenantId },
    })

    if (!payment) throw new NotFoundException('Заявка не найдена')
    if (payment.authorId !== userId) {
      throw new ForbiddenException('Можно удалять только свои заявки')
    }
    if (payment.status !== 'DRAFT') {
      throw new BadRequestException('Можно удалять только черновики')
    }

    // Удаляем вложения
    await this.prisma.attachment.deleteMany({ where: { paymentId: id } })

    return this.prisma.paymentRequest.delete({ where: { id } })
  }

  async submit(id: string, userId: string, tenantId: string) {
    const payment = await this.prisma.paymentRequest.findFirst({
      where: { id, tenantId },
    })

    if (!payment) throw new NotFoundException('Заявка не найдена')
    if (payment.authorId !== userId) {
      throw new ForbiddenException('Можно отправлять только свои заявки')
    }
    if (payment.status !== 'DRAFT') {
      throw new BadRequestException(
        'Отправить на согласование можно только черновик',
      )
    }

    // Пока просто меняем статус. В спринте 3 здесь подключится ApprovalEngine
    return this.prisma.paymentRequest.update({
      where: { id },
      data: { status: 'PENDING_APPROVAL' },
      include: {
        contractor: true,
        author: { select: { id: true, name: true, email: true } },
      },
    })
  }
}
