import { ReactNode, CSSProperties } from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: number
  trendLabel?: string
  /** CSS gradient string เช่น 'linear-gradient(135deg,#3B82F6,#2563EB)' */
  iconBg?: string
  /** สีพื้นหลังอ่อนของการ์ด เช่น 'rgba(59,130,246,0.06)' */
  cardTint?: string
  /** สีของแถบบนสุดการ์ด เช่น '#3B82F6' */
  accentColor?: string
  className?: string
  /** @deprecated ใช้ iconBg แทน */
  gradient?: string
  /** @deprecated ใช้ iconBg แทน */
  iconColor?: string
}

export function KpiCard({
  title, value, subtitle, icon: Icon,
  trend, trendLabel,
  iconBg, cardTint, accentColor,
  className,
}: KpiCardProps) {
  const isPositive = trend !== undefined && trend > 0
  const isNegative = trend !== undefined && trend < 0

  const iconStyle: CSSProperties = iconBg ? { background: iconBg } : { background: 'linear-gradient(135deg,#64748B,#475569)' }
  const tintStyle: CSSProperties = cardTint ? { background: cardTint } : {}
  const accentStyle: CSSProperties = accentColor ? { background: accentColor } : { background: '#64748B' }

  return (
    <div className={cn(
      'group relative rounded-2xl bg-white shadow-[0_2px_12px_rgba(15,23,42,0.08)] border border-slate-200/80',
      'overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.14)]',
      'dark:bg-slate-900 dark:border-slate-800/60',
      className
    )}>
      {/* Accent bar */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl" style={accentStyle} />

      {/* Card tint overlay */}
      {cardTint && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl" style={tintStyle} />
      )}

      <div className="relative flex items-start justify-between gap-4 p-5 pt-6">
        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="mt-2.5 text-[2rem] font-black leading-none tracking-tight text-slate-900 dark:text-slate-50">
            {typeof value === 'number' ? value.toLocaleString('th-TH') : value}
          </p>
          {subtitle && (
            <p className="mt-1.5 text-xs font-medium leading-snug text-slate-500 dark:text-slate-400">
              {subtitle}
            </p>
          )}
          {trend !== undefined && (
            <div className={cn(
              'mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold',
              isPositive ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300' :
              isNegative ? 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300' :
              'border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-300'
            )}>
              {isPositive ? <TrendingUp className="h-3 w-3" /> :
               isNegative ? <TrendingDown className="h-3 w-3" /> :
               <Minus className="h-3 w-3" />}
              {trend > 0 ? '+' : ''}{trend}%
              {trendLabel && <span className="opacity-75">{trendLabel}</span>}
            </div>
          )}
        </div>

        {/* Icon badge */}
        <div
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-md transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3"
          style={iconStyle}
        >
          <Icon className="h-5 w-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]" />
        </div>
      </div>
    </div>
  )
}

interface BentoCardProps {
  children: ReactNode
  className?: string
  title?: string
  description?: string
  action?: ReactNode
}

export function BentoCard({ children, className, title, description, action }: BentoCardProps) {
  return (
    <div className={cn(
      'group rounded-2xl bg-white border border-slate-200/80 shadow-[0_2px_12px_rgba(15,23,42,0.08)]',
      'overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(15,23,42,0.14)]',
      'dark:bg-slate-900 dark:border-slate-800/60',
      className
    )}>
      {(title || action) && (
        <div className="flex items-start justify-between border-b border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-800/40">
          <div>
            {title && <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>}
            {description && <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{description}</p>}
          </div>
          {action && <div className="ml-4 shrink-0">{action}</div>}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  )
}
