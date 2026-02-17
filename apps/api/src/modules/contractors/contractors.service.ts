import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateContractorDto } from './dto/create-contractor.dto'
import { UpdateContractorDto } from './dto/update-contractor.dto'
import { QueryContractorDto } from './dto/query-contractor.dto'
import { paginatedResponse } from '../../common/helpers/pagination.helper'

@Injectable()
export class ContractorsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateContractorDto, tenantId: string) {
    const existing = await this.prisma.contractor.findUnique({
      where: { tenantId_inn: { tenantId, inn: dto.inn } },
    })
    if (existing) {
      throw new ConflictException('Контрагент с таким ИНН уже существует')
    }

    return this.prisma.contractor.create({
      data: { ...dto, tenantId },
    })
  }

  async findAll(query: QueryContractorDto, tenantId: string) {
    const { search, limit = 21, offset = 0 } = query

    const where: any = { tenantId, isActive: true }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { inn: { contains: search } },
      ]
    }

    const [items, total] = await Promise.all([
      this.prisma.contractor.findMany({
        where,
        skip: offset,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      this.prisma.contractor.count({ where }),
    ])

    return paginatedResponse(items, total, limit, offset)
  }

  async findOne(id: string, tenantId: string) {
    const contractor = await this.prisma.contractor.findFirst({
      where: { id, tenantId },
      include: { contracts: true },
    })
    if (!contractor) throw new NotFoundException('Контрагент не найден')
    return contractor
  }

  async update(id: string, dto: UpdateContractorDto, tenantId: string) {
    await this.findOne(id, tenantId)

    if (dto.inn) {
      const duplicate = await this.prisma.contractor.findFirst({
        where: { tenantId, inn: dto.inn, NOT: { id } },
      })
      if (duplicate) {
        throw new ConflictException('Контрагент с таким ИНН уже существует')
      }
    }

    return this.prisma.contractor.update({
      where: { id },
      data: dto,
    })
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId)
    return this.prisma.contractor.update({
      where: { id },
      data: { isActive: false },
    })
  }
}
