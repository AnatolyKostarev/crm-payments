import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function SettingsPage() {
  return (
    <div className="flex h-full min-h-0 w-full flex-col gap-4">
      <h2 className="shrink-0 text-2xl font-bold tracking-tight">Настройки</h2>

      <Card className="gap-4 py-4">
        <CardHeader>
          <CardTitle>Темы оформления</CardTitle>
          <CardDescription>
            Выбор темы перенесён в кнопку смены темы в правой части хедера.
            При клике откроется выпадающий список тем с предпросмотром цветов и
            разделением на светлые и тёмные темы.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  )
}
