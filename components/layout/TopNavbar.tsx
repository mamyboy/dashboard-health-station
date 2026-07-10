"use client"

import {
  CalendarDays,
  PanelLeft, PanelLeftClose, PanelLeftOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TopNavbarProps {
  title?: string
  subtitle?: string
  sidebarCollapsed?: boolean
  sidebarHidden?: boolean
  mobileSidebarOpen?: boolean
  onToggleSidebarCollapse?: () => void
  onToggleSidebarHidden?: () => void
  onToggleMobileSidebar?: () => void
}

export function TopNavbar({
  title = 'ภาพรวมระบบ',
  subtitle,
  sidebarCollapsed = false,
  sidebarHidden = false,
  mobileSidebarOpen = false,
  onToggleSidebarCollapse,
  onToggleSidebarHidden,
  onToggleMobileSidebar,
}: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-30 flex min-h-[64px] items-center gap-2 border-b border-white/70 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-slate-950/75 sm:h-[72px] sm:gap-4 sm:px-6 sm:py-0">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleMobileSidebar}
          className="h-9 w-9 rounded-lg bg-white/60 shadow-sm hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-400/10 md:hidden"
          title={mobileSidebarOpen ? 'ปิด sidebar' : 'เปิด sidebar'}
        >
          {mobileSidebarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebarHidden}
          className="hidden h-9 w-9 rounded-lg bg-white/60 shadow-sm hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-400/10 md:inline-flex"
          title={sidebarHidden ? 'แสดง sidebar' : 'ซ่อน sidebar'}
        >
          {sidebarHidden ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </Button>
        {!sidebarHidden && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebarCollapse}
            className="hidden h-9 w-9 rounded-lg bg-white/60 shadow-sm hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-400/10 md:inline-flex"
            title={sidebarCollapsed ? 'ขยาย sidebar' : 'ย่อ sidebar'}
          >
            <PanelLeft className={cn('h-4 w-4 transition-transform', sidebarCollapsed && 'rotate-180')} />
          </Button>
        )}
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <h1
            className="truncate text-sm font-extrabold tracking-tight sm:text-lg"
            style={{
              backgroundImage: 'linear-gradient(90deg, #0891b2 0%, #0ea5e9 50%, #2563eb 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {title}
          </h1>
        </div>
        {subtitle && <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground sm:text-xs">{subtitle}</p>}
        {!subtitle && (
          <p className="mt-1 hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
            <CalendarDays className="h-3.5 w-3.5" />
            ข้อมูลอัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>

    </header>
  )
}
