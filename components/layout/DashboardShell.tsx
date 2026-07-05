"use client"

import { ReactNode, useState } from 'react'
import { AppSidebar } from './AppSidebar'
import { TopNavbar } from './TopNavbar'
import { Toaster } from '@/components/ui/toaster'
import { cn } from '@/lib/utils'

interface DashboardShellProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

export function DashboardShell({ children, title, subtitle }: DashboardShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [sidebarHidden, setSidebarHidden] = useState(false)

  return (
    <div className="dashboard-bg flex h-screen overflow-hidden bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        hidden={sidebarHidden}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-[padding] duration-300 ease-out',
          sidebarHidden ? 'pl-0' : sidebarCollapsed ? 'pl-20' : 'pl-64',
        )}
      >
        <TopNavbar
          title={title}
          subtitle={subtitle}
          sidebarCollapsed={sidebarCollapsed}
          sidebarHidden={sidebarHidden}
          onToggleSidebarCollapse={() => {
            setSidebarHidden(false)
            setSidebarCollapsed((value) => !value)
          }}
          onToggleSidebarHidden={() => setSidebarHidden((value) => !value)}
        />
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
