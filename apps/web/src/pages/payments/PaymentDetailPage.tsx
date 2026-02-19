import { useParams, useNavigate } from 'react-router'
import { ArrowLeft, Loader2, FileText, Calendar, User, Building2 } from 'lucide-react'
import { usePayment } from '@/entities/payment/hooks'
import { StatusBadge } from '@/entities/payment/ui/StatusBadge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

export function PaymentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data, isLoading } = usePayment(id || '')

  const payment = data?.data

  const formatAmount = (amount: string, currency: string) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(Number(amount))
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getDecisionBadgeVariant = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return 'bg-green-100 text-green-700'
      case 'REJECTED':
        return 'bg-red-100 text-red-700'
      case 'REVISION':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getDecisionLabel = (decision: string) => {
    switch (decision) {
      case 'APPROVED':
        return 'Одобрено'
      case 'REJECTED':
        return 'Отклонено'
      case 'REVISION':
        return 'На доработку'
      default:
        return 'Ожидает'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!payment) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/payments')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="py-12 text-center text-muted-foreground">
          Заявка не найдена
        </div>
      </div>
    )
  }

  const sortedApprovals = payment.approvals
    ? [...payment.approvals].sort((a, b) => a.stepOrder - b.stepOrder)
    : []

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate('/payments')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-between flex-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Заявка №{payment.number}
          </h1>
          <StatusBadge status={payment.status} />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Основная информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Сумма</p>
              <p className="text-lg font-semibold">
                {formatAmount(payment.amount, payment.currency)}
              </p>
            </div>
            {payment.dueDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Срок оплаты
                </p>
                <p className="text-lg">{formatDate(payment.dueDate)}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Назначение платежа</p>
            <p className="text-base">{payment.purpose}</p>
          </div>

          <Separator />

          {/* Контрагент */}
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <Building2 className="h-4 w-4" />
              Контрагент
            </p>
            <div className="bg-muted/50 rounded-md p-3">
              <p className="font-medium">{payment.contractor.name}</p>
              <p className="text-sm text-muted-foreground">
                ИНН: {payment.contractor.inn}
              </p>
            </div>
          </div>

          {/* Договор */}
          {payment.contract && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Договор
                </p>
                <div className="bg-muted/50 rounded-md p-3">
                  <p className="font-medium">№ {payment.contract.number}</p>
                  <p className="text-sm text-muted-foreground">
                    от {formatDate(payment.contract.date)}
                  </p>
                  {payment.contract.endDate && (
                    <p className="text-sm text-muted-foreground">
                      до {formatDate(payment.contract.endDate)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Вложения */}
          {payment.attachments && payment.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Вложения ({payment.attachments.length})
                </p>
                <div className="space-y-2">
                  {payment.attachments.map((attachment) => (
                    <div
                      key={attachment.id}
                      className="bg-muted/50 rounded-md p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">
                            {attachment.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {(attachment.fileSize / 1024).toFixed(2)} КБ
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* История согласований */}
          {sortedApprovals.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  История согласований ({sortedApprovals.length})
                </p>
                <div className="space-y-3">
                  {sortedApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="bg-muted/50 rounded-md p-3"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {approval.approver.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Шаг {approval.stepOrder}
                          </p>
                        </div>
                        <Badge
                          variant="outline"
                          className={`border-0 ${getDecisionBadgeVariant(
                            approval.decision
                          )}`}
                        >
                          {getDecisionLabel(approval.decision)}
                        </Badge>
                      </div>
                      {approval.comment && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {approval.comment}
                        </p>
                      )}
                      {approval.decidedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatDateTime(approval.decidedAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Метаданные */}
          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Автор</p>
              <p>{payment.author.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Дата создания</p>
              <p>{formatDateTime(payment.createdAt)}</p>
            </div>
            {payment.updatedAt !== payment.createdAt && (
              <div>
                <p className="text-muted-foreground mb-1">Последнее обновление</p>
                <p>{formatDateTime(payment.updatedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
