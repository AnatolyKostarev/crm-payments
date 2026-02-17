import { z } from 'zod'

const emailSchema = z
  .string()
  .min(1, 'Email обязателен')
  .email('Некорректный формат email')
  .refine(val => /^[a-zA-Z0-9@._+-]+$/.test(val), 'Только латинские символы')

const loginPasswordSchema = z
  .string()
  .min(1, 'Пароль обязателен')
  .regex(/^[^\u0400-\u04FF]+$/, 'Только латинские символы')
  .min(6, 'Минимум 6 символов')

const registerPasswordSchema = loginPasswordSchema
  .regex(/[a-z]/, 'Должна быть хотя бы одна строчная буква')
  .regex(/[A-Z]/, 'Должна быть хотя бы одна заглавная буква')
  .regex(/[^a-zA-Z0-9]/, 'Должен быть хотя бы один спецсимвол (!@#$%...)')

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
})

export const registerSchema = z.object({
  companyName: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(100, 'Максимум 100 символов'),
  name: z
    .string()
    .min(2, 'Минимум 2 символа')
    .max(50, 'Максимум 50 символов'),
  email: emailSchema,
  password: registerPasswordSchema,
})

export type LoginFormValues = z.infer<typeof loginSchema>
export type RegisterFormValues = z.infer<typeof registerSchema>
