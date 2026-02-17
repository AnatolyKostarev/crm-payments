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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { loginSchema, type LoginFormValues } from '../model/schemas'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const setAuth = useSessionStore(s => s.setAuth)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
  })

  const onSubmit = useCallback(
    async (data: LoginFormValues) => {
      setLoading(true)
      try {
        const res = await sessionApi.login(data)
        setAuth(res.data)
        toast.success('Добро пожаловать!')
        navigate('/')
      } catch (error) {
        toast.error(getApiError(error, 'Неверный email или пароль'))
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
              <FormDescription>Только латинские символы</FormDescription>
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
                  placeholder="••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormDescription>Минимум 6 символов, латиница</FormDescription>
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
          Войти
        </Button>
      </form>
    </Form>
  )
}
