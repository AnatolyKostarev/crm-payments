import type { PaginationParams } from '@/shared/types'

export interface Contractor {
  id: string
  name: string
  inn: string
  kpp?: string | null
  bankName?: string | null
  bik?: string | null
  account?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface CreateContractorRequest {
  name: string
  inn: string
  kpp?: string
  bankName?: string
  bik?: string
  account?: string
}

export type UpdateContractorRequest = Partial<CreateContractorRequest>

export interface ContractorQuery extends PaginationParams {
  search?: string
}
