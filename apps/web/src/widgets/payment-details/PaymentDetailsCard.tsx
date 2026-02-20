import {
  ArrowLeft,
  FileText,
  Calendar,
  User,
  Building2,
} from 'lucide-react'
import { StatusBadge } from '@/entities/payment/ui/StatusBadge'
import type { PaymentDetail } from '@/entities/payment/types'
import {
  formatPaymentAmount,
  formatPaymentDate,
  formatPaymentDateTime,
} from '@/entities/payment/lib/formatters'
import {
  getApprovalDecisionBadgeVariant,
  getApprovalDecisionLabel,
  sortApprovalsByStep,
} from '@/entities/payment/lib/approvals'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

interface PaymentDetailsCardProps {
  payment: PaymentDetail
  onBack: () => void
}

export function PaymentDetailsCard({ payment, onBack }: PaymentDetailsCardProps) {
  const sortedApprovals = sortApprovalsByStep(payment.approvals)

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center justify-between flex-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Заявка №{payment.number}
          </h2>
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
                {formatPaymentAmount(payment.amount, payment.currency)}
              </p>
            </div>
            {payment.dueDate && (
              <div>
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Срок оплаты
                </p>
                <p className="text-lg">{formatPaymentDate(payment.dueDate)}</p>
              </div>
            )}
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">
              Назначение платежа
            </p>
            <p className="text-base">{payment.purpose}</p>
          </div>

          <Separator />

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
                    от {formatPaymentDate(payment.contract.date)}
                  </p>
                  {payment.contract.endDate && (
                    <p className="text-sm text-muted-foreground">
                      до {formatPaymentDate(payment.contract.endDate)}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

          {payment.attachments && payment.attachments.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Вложения ({payment.attachments.length})
                </p>
                <div className="space-y-2">
                  {payment.attachments.map(attachment => (
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

          {sortedApprovals.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  История согласований ({sortedApprovals.length})
                </p>
                <div className="space-y-3">
                  {sortedApprovals.map(approval => (
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
                          className={`border-0 ${getApprovalDecisionBadgeVariant(
                            approval.decision
                          )}`}
                        >
                          {getApprovalDecisionLabel(approval.decision)}
                        </Badge>
                      </div>
                      {approval.comment && (
                        <p className="text-sm text-muted-foreground mt-2">
                          {approval.comment}
                        </p>
                      )}
                      {approval.decidedAt && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {formatPaymentDateTime(approval.decidedAt)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Автор</p>
              <p>{payment.author.name}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Дата создания</p>
              <p>{formatPaymentDateTime(payment.createdAt)}</p>
            </div>
            {payment.updatedAt !== payment.createdAt && (
              <div>
                <p className="text-muted-foreground mb-1">
                  Последнее обновление
                </p>
                <p>{formatPaymentDateTime(payment.updatedAt)}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
