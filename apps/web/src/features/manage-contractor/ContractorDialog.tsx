/* eslint-disable @typescript-eslint/no-explicit-any */
import { memo, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  useCreateContractor,
  useUpdateContractor,
} from '@/entities/contractor/hooks'
import { getApiError } from '@/shared/lib/get-api-error'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import type { Contractor } from '@/entities/contractor/types'

const contractorSchema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(200),
  inn: z.string().min(10, 'ИНН: 10–12 цифр').max(12),
  kpp: z.string().max(9).optional().or(z.literal('')),
  bankName: z.string().max(200).optional().or(z.literal('')),
  bik: z.string().max(9).optional().or(z.literal('')),
  account: z.string().max(20).optional().or(z.literal('')),
})

type ContractorForm = z.infer<typeof contractorSchema>

interface ContractorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractor: Contractor | null
}

const DEFAULT_FORM_VALUES: ContractorForm = {
  name: '',
  inn: '',
  kpp: '',
  bankName: '',
  bik: '',
  account: '',
}

function ContractorDialogInner({
  open,
  onOpenChange,
  contractor,
}: ContractorDialogProps) {
  const isEdit = !!contractor
  const createMutation = useCreateContractor()
  const updateMutation = useUpdateContractor()
  const isLoading = createMutation.isPending || updateMutation.isPending

  const form = useForm<ContractorForm>({
    resolver: zodResolver(contractorSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  })

  useEffect(() => {
    if (open) {
      form.reset({
        name: contractor?.name ?? '',
        inn: contractor?.inn ?? '',
        kpp: contractor?.kpp ?? '',
        bankName: contractor?.bankName ?? '',
        bik: contractor?.bik ?? '',
        account: contractor?.account ?? '',
      })
    }
  }, [open, contractor, form])

  const handleClose = useCallback(() => onOpenChange(false), [onOpenChange])

  const onSubmit = useCallback(
    async (data: ContractorForm) => {
      try {
        if (isEdit && contractor) {
          const updateData: Record<string, string> = {}
          for (const [key, value] of Object.entries(data)) {
            if (key === 'name' || key === 'inn') {
              updateData[key] = value
            } else if (value !== '') {
              updateData[key] = value
            }
          }
          await updateMutation.mutateAsync({
            id: contractor.id,
            data: updateData,
          })
          toast.success('Контрагент обновлён')
        } else {
          const cleaned = Object.fromEntries(
            Object.entries(data).filter(([, v]) => v !== '')
          )
          await createMutation.mutateAsync(cleaned as any)
          toast.success('Контрагент создан')
        }
        onOpenChange(false)
      } catch (error) {
        const errorMessage = await getApiError(
          error,
          isEdit
            ? 'Ошибка обновления контрагента'
            : 'Ошибка создания контрагента'
        )
        toast.error(errorMessage)
      }
    },
    [
      isEdit,
      contractor,
      onOpenChange,
      createMutation,
      updateMutation,
    ]
  )

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Редактирование контрагента' : 'Новый контрагент'}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ООО «Ромашка»"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="inn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ИНН</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="7707083893"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kpp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>КПП</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="770701001"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Банк</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ПАО Сбербанк"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bik"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>БИК</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="044525225"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="account"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Расчётный счёт</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="40702810..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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
                {isEdit ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export const ContractorDialog = memo(ContractorDialogInner)
