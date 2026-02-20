import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { contractorsApi } from './api'
import type {
  ContractorQuery,
  CreateContractorRequest,
  UpdateContractorRequest,
} from './types'

export const contractorKeys = {
  all: ['contractors'] as const,
  list: (params?: ContractorQuery) =>
    [...contractorKeys.all, 'list', params] as const,
  detail: (id: string) => [...contractorKeys.all, 'detail', id] as const,
}

interface UseContractorsOptions {
  enabled?: boolean
}

export function useContractors(
  params?: ContractorQuery,
  options?: UseContractorsOptions
) {
  return useQuery({
    queryKey: contractorKeys.list(params),
    queryFn: () => contractorsApi.getAll(params),
    enabled: options?.enabled ?? true,
  })
}

export function useContractor(id: string) {
  return useQuery({
    queryKey: contractorKeys.detail(id),
    queryFn: () => contractorsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreateContractor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateContractorRequest) => contractorsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contractorKeys.all }),
  })
}

export function useUpdateContractor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateContractorRequest }) =>
      contractorsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: contractorKeys.all }),
  })
}

export function useDeleteContractor() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => contractorsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: contractorKeys.all }),
  })
}
