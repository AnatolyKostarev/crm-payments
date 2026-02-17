import { useTheme } from '@/shared/hooks/use-theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Инициализация темы при загрузке компонента
  useTheme()
  
  return <>{children}</>
}
