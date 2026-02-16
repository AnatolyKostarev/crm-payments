import { Button } from '@/components/ui/button'

function App() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">CRM Payments</h1>
        <p className="text-gray-400 mb-6">Система согласования платежей</p>
        <Button>Начать</Button>
      </div>
    </div>
  )
}

export default App
