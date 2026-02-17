import { useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useSessionStore, sessionApi } from '@/entities/session'
import { getApiError } from '@/shared/lib/get-api-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/shared/ui/password-input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { registerSchema, type RegisterFormValues } from '../model/schemas'

export function RegisterForm() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useSessionStore(s => s.setAuth)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      name: '',
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = useCallback(
    async (data: RegisterFormValues) => {
      setLoading(true)
      try {
        const res = await sessionApi.register(data)
        setAuth({
          user: res.data.user,
          tenant: res.data.tenant,
          permissions: res.data.permissions || [],
          accessToken: res.data.accessToken,
        })
        toast.success('Компания зарегистрирована!')
        navigate('/')
      } catch (error) {
        toast.error(getApiError(error, 'Ошибка регистрации. Возможно, email уже занят.'))
      } finally {
        setLoading(false)
      }
    },
    [setAuth, navigate],
  )

  const handleSubmit = form.handleSubmit(onSubmit)

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название компании</FormLabel>
              <FormControl>
                <Input
                  placeholder="ООО «Компания»"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ваше имя</FormLabel>
              <FormControl>
                <Input
                  placeholder="Иван Петров"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@company.ru"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Минимум 6 символов"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={loading}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Зарегистрироваться
        </Button>
      </form>
    </Form>
  )
}
