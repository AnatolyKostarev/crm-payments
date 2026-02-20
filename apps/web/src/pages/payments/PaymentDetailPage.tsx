import { useParams, useNavigate } from 'react-router'
import { usePayment } from '@/entities/payment/hooks'
import { PaymentDetailsCard } from '@/widgets/payment-details/PaymentDetailsCard'
import { PageLoadingState, PageNotFoundState } from '@/shared/ui/page-state'

export function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = usePayment(id || '')

  const payment = data?.data

  if (isLoading) {
    return <PageLoadingState />
  }

  if (!payment) {
    return (
      <PageNotFoundState
        message="Заявка не найдена"
        onBack={() => navigate('/payments')}
      />
    )
  }

  return <PaymentDetailsCard payment={payment} onBack={() => navigate('/payments')} />
}
