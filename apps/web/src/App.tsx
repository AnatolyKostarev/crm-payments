import { Providers } from '@/app/providers'
import { AppRouter } from '@/app/router'
import { SessionRestore } from '@/app/SessionRestore'

function App() {
  return (
    <Providers>
      <SessionRestore />
      <AppRouter />
    </Providers>
  )
}

export default App
