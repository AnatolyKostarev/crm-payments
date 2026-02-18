import { Suspense } from 'react'
import { Outlet } from 'react-router'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { PageLoader } from '@/shared/ui/page-loader'
import { AppSidebar } from './Sidebar'
import { Header } from './Header'

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <main className="flex flex-1 flex-col overflow-hidden px-[10px] py-4">
          <div className="flex flex-1 flex-col min-h-0 w-full">
            <Suspense fallback={<PageLoader />}>
              <Outlet />
            </Suspense>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
