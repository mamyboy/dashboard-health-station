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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true)
  const [sidebarHidden, setSidebarHidden] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  return (
    <div className="dashboard-bg flex h-screen overflow-hidden bg-background">
      <AppSidebar
        collapsed={sidebarCollapsed}
        hidden={sidebarHidden}
        mobileOpen={mobileSidebarOpen}
        onToggleCollapse={() => setSidebarCollapsed((value) => !value)}
      />
      {!sidebarHidden && mobileSidebarOpen && (
        <button
          type="button"
          aria-label="ปิด sidebar"
          className="fixed inset-0 z-30 bg-slate-950/45 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}
      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-[padding] duration-300 ease-out',
          sidebarHidden ? 'pl-0' : sidebarCollapsed ? 'pl-0 md:pl-20' : 'pl-0 md:pl-64',
        )}
      >
        <TopNavbar
          title={title}
          subtitle={subtitle}
          sidebarCollapsed={sidebarCollapsed}
          sidebarHidden={sidebarHidden}
          mobileSidebarOpen={mobileSidebarOpen}
          onToggleSidebarCollapse={() => {
            setSidebarHidden(false)
            setSidebarCollapsed((value) => !value)
          }}
          onToggleSidebarHidden={() => {
            setSidebarHidden((value) => !value)
            setMobileSidebarOpen(false)
          }}
          onToggleMobileSidebar={() => {
            setSidebarHidden(false)
            setMobileSidebarOpen((value) => !value)
          }}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1560px] p-3 sm:p-4 lg:p-6">
            {children}
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
