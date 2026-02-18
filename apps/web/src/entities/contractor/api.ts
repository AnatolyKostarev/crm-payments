import { api } from '@/shared/api/client'
import type {
  Contractor,
  CreateContractorRequest,
  UpdateContractorRequest,
  ContractorQuery,
} from './types'
import type { PaginatedResponse } from '@/shared/types'
import { toSearchParams } from '@/shared/lib/utils'

export const contractorsApi = {
  getAll: (params?: ContractorQuery) =>
    api
      .get('contractors', { searchParams: toSearchParams(params) })
      .json<PaginatedResponse<Contractor>>(),

  getById: (id: string) =>
    api.get(`contractors/${id}`).json<{ data: Contractor }>(),

  create: (data: CreateContractorRequest) =>
    api.post('contractors', { json: data }).json<{ data: Contractor }>(),

  update: (id: string, data: UpdateContractorRequest) =>
    api.patch(`contractors/${id}`, { json: data }).json<{ data: Contractor }>(),

  remove: (id: string) => api.delete(`contractors/${id}`).json(),
}
