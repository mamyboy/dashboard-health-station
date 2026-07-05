"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, HeartPulse, ChevronRight, Activity, MapPinned, ShieldCheck
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  {
    title: 'ภาพรวมระบบ',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-hidden border-r border-white/10 bg-slate-950 text-white shadow-2xl">
      <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-br from-cyan-500/25 via-emerald-400/15 to-amber-300/10" />

      {/* Logo */}
      <div className="relative flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 shadow-lg shadow-cyan-500/20">
          <HeartPulse className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">Health Station</p>
          <p className="flex items-center gap-1 text-[10px] font-medium text-cyan-200">
            <MapPinned className="h-3 w-3" />
            จังหวัดสตูล
          </p>
        </div>
      </div>

      {/* System Status */}
      <div className="relative mx-4 mt-4 rounded-lg border border-emerald-300/20 bg-emerald-400/10 px-3 py-3 shadow-inner">
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-emerald-300" />
          <span className="text-xs text-emerald-400 font-medium">ระบบทำงานปกติ</span>
        </div>
        <p className="mt-1 text-[10px] text-white/45">Live data prototype</p>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/35">เมนูหลัก</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-white text-slate-950 shadow-lg shadow-cyan-500/15'
                  : 'text-white/65 hover:bg-white/10 hover:text-white'
              )}
            >
              <item.icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-cyan-600' : 'text-white/50 group-hover:text-white')} />
              <span className="flex-1">{item.title}</span>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-slate-400" />}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="relative border-t border-white/10 px-4 py-4">
        <div className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-amber-300" />
            <p className="text-xs font-semibold text-white/85">สำนักงานสาธารณสุข</p>
          </div>
          <p className="mt-1 text-[10px] text-white/45">จังหวัดสตูล • ปีงบประมาณ 2568</p>
        </div>
      </div>
    </aside>
  )
}
