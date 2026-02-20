import { useState } from 'react'
import { Link } from 'react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LoginForm } from '@/features/auth'
import LogoIcon from '../../assets/logo.png'

export function LoginPage() {
  const [logoBroken, setLogoBroken] = useState(false)

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-8 sm:py-12">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center text-sm font-bold text-primary">
            {!logoBroken ? (
              <img
                src={LogoIcon}
                alt="CRM Payments logo"
                className="h-10 w-10 object-contain rounded-md"
                onError={() => setLogoBroken(true)}
              />
            ) : (
              'CP'
            )}
          </div>

          <CardTitle className="text-xl">Вход в систему</CardTitle>
          <CardDescription>Введите данные для входа</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Нет аккаунта?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:underline"
            >
              Зарегистрируйтесь
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
