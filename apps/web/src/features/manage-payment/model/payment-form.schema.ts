import { z } from 'zod'

export const paymentFormSchema = z.object({
  amount: z
    .string()
    .min(1, 'Обязательное поле')
    .refine(v => !isNaN(Number(v)) && Number(v) >= 0.01, 'Минимум 0.01'),
  purpose: z.string().min(1, 'Обязательное поле').max(500),
  contractorId: z.string().min(1, 'Выберите контрагента'),
  dueDate: z.string().optional().or(z.literal('')),
})

export type PaymentFormValues = z.infer<typeof paymentFormSchema>

export const paymentFormDefaultValues: PaymentFormValues = {
  amount: '',
  purpose: '',
  contractorId: '',
  dueDate: '',
}
