import { api } from '@/shared/api/client'
import type {
  Payment,
  PaymentDetail,
  CreatePaymentRequest,
  UpdatePaymentRequest,
  PaymentQuery,
} from './types'
import type { PaginatedResponse } from '@/shared/types'
import { toSearchParams } from '@/shared/lib/utils'

export const paymentsApi = {
  getAll: (params?: PaymentQuery) =>
    api
      .get('payments', { searchParams: toSearchParams(params) })
      .json<PaginatedResponse<Payment>>(),

  getById: (id: string) =>
    api.get(`payments/${id}`).json<{ data: PaymentDetail }>(),

  create: (data: CreatePaymentRequest) =>
    api.post('payments', { json: data }).json<{ data: Payment }>(),

  update: (id: string, data: UpdatePaymentRequest) =>
    api.patch(`payments/${id}`, { json: data }).json<{ data: Payment }>(),

  remove: (id: string) => api.delete(`payments/${id}`).json(),

  submit: (id: string) =>
    api.post(`payments/${id}/submit`).json<{ data: Payment }>(),
}
