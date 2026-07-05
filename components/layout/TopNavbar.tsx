"use client"

import { Bell, Search, Moon, Sun, RefreshCw, User, Sparkles, CalendarDays } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface TopNavbarProps {
  title?: string
  subtitle?: string
}

export function TopNavbar({ title = 'ภาพรวมระบบ', subtitle }: TopNavbarProps) {
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const handleRefresh = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      toast({ title: 'อัปเดตข้อมูลสำเร็จ', description: 'ข้อมูลจำลองได้รับการโหลดใหม่', variant: 'success' })
    }, 1200)
  }

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center gap-4 border-b border-white/70 bg-white/80 px-6 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 dark:border-white/10 dark:bg-slate-950/75">
      {/* Title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-300">
            <Sparkles className="h-4 w-4" />
          </span>
          <h1 className="truncate text-lg font-bold text-foreground">{title}</h1>
        </div>
        {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
        {!subtitle && (
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            ข้อมูลอัปเดตล่าสุด: {new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="ค้นหา..." className="h-9 w-56 rounded-lg border-white/80 bg-white/70 pl-9 text-sm shadow-sm dark:border-white/10 dark:bg-white/5" />
        </div>

        <Button variant="ghost" size="icon" onClick={handleRefresh} disabled={loading} className="h-9 w-9 rounded-lg bg-white/50 shadow-sm hover:bg-cyan-50 dark:bg-white/5 dark:hover:bg-cyan-400/10">
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </Button>

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg bg-white/50 shadow-sm hover:bg-amber-50 dark:bg-white/5 dark:hover:bg-amber-400/10"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        )}

        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg bg-white/50 shadow-sm hover:bg-rose-50 dark:bg-white/5 dark:hover:bg-rose-400/10">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-950" />
        </Button>

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 via-sky-500 to-emerald-400 text-xs font-bold text-white shadow-lg shadow-cyan-500/20">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  )
}
