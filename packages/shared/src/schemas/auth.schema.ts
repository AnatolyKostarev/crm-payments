import { z } from 'zod'

export const loginSchema = z.object({
  email: z.email({ error: 'Некорректный email' }),
  password: z.string().min(6, { error: 'Минимум 6 символов' }),
})

export const registerSchema = z.object({
  companyName: z
    .string()
    .min(2, { error: 'Минимум 2 символа' })
    .max(100, { error: 'Максимум 100 символов' }),
  email: z.email({ error: 'Некорректный email' }),
  password: z.string().min(6, { error: 'Минимум 6 символов' }),
  name: z.string().min(2, { error: 'Минимум 2 символа' }).max(50, { error: 'Максимум 50 символов' }),
})

export type LoginDto = z.infer<typeof loginSchema>
export type RegisterDto = z.infer<typeof registerSchema>
