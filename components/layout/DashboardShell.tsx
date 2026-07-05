import { ReactNode } from 'react'
import { AppSidebar } from './AppSidebar'
import { TopNavbar } from './TopNavbar'
import { Toaster } from '@/components/ui/toaster'

interface DashboardShellProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  return (
    <div className="dashboard-bg flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden pl-64">
        <TopNavbar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1560px] p-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
