"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, HeartPulse, ChevronRight, Activity, MapPinned, ShieldCheck, PanelLeftClose
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    title: 'ภาพรวมระบบ',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
]

interface AppSidebarProps {
  collapsed?: boolean
  hidden?: boolean
  onToggleCollapse?: () => void
}

export function AppSidebar({ collapsed = false, hidden = false, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 flex h-screen flex-col overflow-hidden border-r border-white/10 bg-slate-950 text-white shadow-2xl transition-all duration-300 ease-out',
        collapsed ? 'w-20' : 'w-64',
        hidden && '-translate-x-full',
      )}
    >
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-br from-cyan-500/25 via-emerald-400/15 to-amber-300/10" />

      {/* Logo */}
      <div className={cn('relative flex items-center gap-3 border-b border-white/10 py-5', collapsed ? 'justify-center px-3' : 'px-5')}>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 shadow-lg shadow-cyan-500/20">
          <HeartPulse className="h-5 w-5 text-white" />
        </div>
        <div className={cn('min-w-0 transition-opacity duration-200', collapsed && 'hidden')}>
          <p className="text-sm font-bold text-white leading-tight">Health Station</p>
          <p className="flex items-center gap-1 text-[10px] font-medium text-cyan-200">
            <MapPinned className="h-3 w-3" />
            จังหวัดสตูล
          </p>
        </div>
        {!collapsed && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="ml-auto h-8 w-8 rounded-lg bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            title="ย่อ sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* System Status */}
      <div className={cn(
        'relative mx-4 mt-4 rounded-lg border border-emerald-300/20 bg-emerald-400/10 shadow-inner',
        collapsed ? 'px-2 py-3' : 'px-3 py-3',
      )}>
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-emerald-300" />
          <span className={cn('text-xs text-emerald-400 font-medium', collapsed && 'hidden')}>ระบบทำงานปกติ</span>
        </div>
        <p className={cn('mt-1 text-[10px] text-white/45', collapsed && 'hidden')}>Live data prototype</p>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className={cn('mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35', collapsed && 'sr-only')}>เมนูหลัก</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                collapsed && 'justify-center px-0',
                isActive
                  ? 'bg-white text-slate-950 shadow-lg shadow-cyan-500/15'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-cyan-600' : 'text-white/50 group-hover:text-white')} />
              <span className={cn('flex-1', collapsed && 'hidden')}>{item.title}</span>
              {isActive && !collapsed && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn('relative border-t border-white/10 px-4 py-4', collapsed && 'px-3')}>
        <div className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3">
          <div className={cn('flex items-center gap-2', collapsed && 'justify-center')}>
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <p className={cn('text-xs font-semibold text-white/85', collapsed && 'hidden')}>สำนักงานสาธารณสุข</p>
          </div>
          <p className={cn('mt-1 text-[10px] text-white/45', collapsed && 'hidden')}>จังหวัดสตูล • ปีงบประมาณ 2568</p>
        </div>
      </div>
    </aside>
  )
}
