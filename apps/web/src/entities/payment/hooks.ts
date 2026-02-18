import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { paymentsApi } from './api'
import type {
  PaymentQuery,
  CreatePaymentRequest,
  UpdatePaymentRequest,
} from './types'

export const paymentKeys = {
  all: ['payments'] as const,
  list: (params?: PaymentQuery) =>
    [...paymentKeys.all, 'list', params] as const,
  detail: (id: string) => [...paymentKeys.all, 'detail', id] as const,
}

export function usePayments(params?: PaymentQuery) {
  return useQuery({
    queryKey: paymentKeys.list(params),
    queryFn: () => paymentsApi.getAll(params),
  })
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => paymentsApi.getById(id),
    enabled: !!id,
  })
}

export function useCreatePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CreatePaymentRequest) => paymentsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  })
}

export function useUpdatePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePaymentRequest }) =>
      paymentsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  })
}

export function useDeletePayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentsApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  })
}

export function useSubmitPayment() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => paymentsApi.submit(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: paymentKeys.all }),
  })
}
