import { useNavigate } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { PaymentCreateForm } from '@/features/manage-payment/PaymentCreateForm'
import { Button } from '@/components/ui/button'

export function PaymentCreatePage() {
  const navigate = useNavigate()

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
        <h2 className="text-2xl font-bold tracking-tight">Новая заявка</h2>
      </div>
      <PaymentCreateForm
        onCancel={() => navigate('/payments')}
        onCreated={() => navigate('/payments')}
      />
    </div>
  )
}
