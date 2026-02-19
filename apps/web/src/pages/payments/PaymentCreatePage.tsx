import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import { useCreatePayment } from '@/entities/payment/hooks'
import { ContractorCombobox } from '@/entities/contractor/ui/ContractorCombobox'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

const paymentSchema = z.object({
  amount: z
    .string()
    .min(1, 'Обязательное поле')
    .refine(v => !isNaN(Number(v)) && Number(v) >= 0.01, 'Минимум 0.01'),
  purpose: z.string().min(1, 'Обязательное поле').max(500),
  contractorId: z.string().min(1, 'Выберите контрагента'),
  dueDate: z.string().optional().or(z.literal('')),
})

type PaymentForm = z.infer<typeof paymentSchema>

export function PaymentCreatePage() {
  const navigate = useNavigate()
  const [submitAfter, setSubmitAfter] = useState(false)
  const createMutation = useCreatePayment()

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: '',
      purpose: '',
      contractorId: '',
      dueDate: '',
    },
  })

  const onSubmit = async (data: PaymentForm) => {
    try {
      await createMutation.mutateAsync({
        amount: Number(data.amount),
        purpose: data.purpose,
        contractorId: data.contractorId,
        dueDate: data.dueDate || undefined,
      })
      if (submitAfter) {
        toast.success('Заявка создана и отправлена на согласование')
      } else {
        toast.success('Черновик сохранён')
      }
      navigate('/payments')
    } catch {
      toast.error('Ошибка создания заявки')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/payments')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Новая заявка</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Данные заявки</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="contractorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Контрагент</FormLabel>
                    <FormControl>
                      <ContractorCombobox
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Сумма, ₽</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dueDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Срок оплаты</FormLabel>
                      <FormControl>
                        <DatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Выберите дату"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="purpose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Назначение платежа</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Оплата по договору №..."
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/payments')}
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  disabled={createMutation.isPending}
                  onClick={() => setSubmitAfter(false)}
                >
                  {createMutation.isPending && !submitAfter && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Сохранить черновик
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  onClick={() => setSubmitAfter(true)}
                >
                  {createMutation.isPending && submitAfter && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Отправить на согласование
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
