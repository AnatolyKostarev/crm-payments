import { memo, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { usePayment, useUpdatePayment } from '@/entities/payment/hooks'
import { ContractorCombobox } from '@/entities/contractor/ui/ContractorCombobox'
import { DatePicker } from '@/shared/ui/DatePicker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  paymentFormSchema,
  paymentFormDefaultValues,
  type PaymentFormValues,
} from './model/payment-form.schema'

interface PaymentEditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  paymentId: string | null
}

function PaymentEditDialogInner({
  open,
  onOpenChange,
  paymentId,
}: PaymentEditDialogProps) {
  const { data: paymentData, isLoading: isLoadingPayment } = usePayment(
    paymentId || ''
  )
  const updateMutation = useUpdatePayment()
  const isLoading = updateMutation.isPending

  const payment = paymentData?.data

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: paymentFormDefaultValues,
  })

  useEffect(() => {
    if (open && payment) {
      // Преобразуем dueDate из ISO формата в YYYY-MM-DD для input type="date"
      const formatDateForInput = (dateString: string | null): string => {
        if (!dateString) return ''
        try {
          const date = new Date(dateString)
          const year = date.getFullYear()
          const month = String(date.getMonth() + 1).padStart(2, '0')
          const day = String(date.getDate()).padStart(2, '0')
          return `${year}-${month}-${day}`
        } catch {
          return ''
        }
      }

      form.reset({
        amount: String(payment.amount),
        purpose: payment.purpose,
        contractorId: payment.contractorId,
        dueDate: formatDateForInput(payment.dueDate),
      })
    }
  }, [open, payment, form])

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange])

  const onSubmit = useCallback(
    async (data: PaymentFormValues) => {
      if (!paymentId || !payment) return

      try {
        const updateData: {
          amount?: number
          purpose?: string
          contractorId?: string
          dueDate?: string
        } = {}

        if (data.amount !== String(payment.amount)) {
          updateData.amount = Number(data.amount)
        }
        if (data.purpose !== payment.purpose) {
          updateData.purpose = data.purpose
        }
        if (data.contractorId !== payment.contractorId) {
          updateData.contractorId = data.contractorId
        }
        if (data.dueDate !== (payment.dueDate || '')) {
          updateData.dueDate = data.dueDate || undefined
        }

        if (Object.keys(updateData).length === 0) {
          toast.info('Нет изменений для сохранения')
          return
        }

        await updateMutation.mutateAsync({
          id: paymentId,
          data: updateData,
        })
        toast.success('Заявка обновлена')
        onOpenChange(false)
      } catch {
        toast.error('Ошибка обновления заявки')
      }
    },
    [paymentId, payment, onOpenChange, updateMutation]
  )

  if (isLoadingPayment) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="sm:max-w-2xl">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!payment) {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="sm:max-w-2xl">
          <div className="py-12 text-center text-muted-foreground">
            Заявка не найдена
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Редактирование заявки №{payment.number}</DialogTitle>
        </DialogHeader>
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

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Сохранить
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export const PaymentEditDialog = memo(PaymentEditDialogInner)
