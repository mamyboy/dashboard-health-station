"use client"

import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'

const COLORS = {
  blue: '#2563EB',
  cyan: '#06B6D4',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#EF4444',
  purple: '#8B5CF6',
}

interface TrendChartProps {
  data: Array<{ month: string; count: number; atRisk: number; referred: number }>
  height?: number
}

export function TrendChart({ data, height = 260 }: TrendChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.15} />
            <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorAtRisk" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={COLORS.amber} stopOpacity={0.15} />
            <stop offset="95%" stopColor={COLORS.amber} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
          labelStyle={{ fontWeight: 600 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Area type="monotone" dataKey="count" name="ผู้รับบริการ" stroke={COLORS.blue} strokeWidth={2} fill="url(#colorCount)" dot={false} activeDot={{ r: 4 }} />
        <Area type="monotone" dataKey="atRisk" name="กลุ่มเสี่ยง" stroke={COLORS.amber} strokeWidth={2} fill="url(#colorAtRisk)" dot={false} activeDot={{ r: 4 }} />
        <Line type="monotone" dataKey="referred" name="ส่งต่อ" stroke={COLORS.red} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

interface BarComparisonChartProps {
  data: Array<{ district: string; total: number; atRisk: number }>
  height?: number
}

export function BarComparisonChart({ data, height = 260 }: BarComparisonChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }} barGap={4}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="district" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="total" name="ผู้รับบริการ" fill={COLORS.blue} radius={[6, 6, 0, 0]} />
        <Bar dataKey="atRisk" name="กลุ่มเสี่ยง" fill={COLORS.amber} radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface DonutChartProps {
  data: Array<{ label: string; count: number; percentage: number; color: string }>
  height?: number
}

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number
}) => {
  if (percent < 0.05) return null
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export function DonutRiskChart({ data, height = 220 }: DonutChartProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row">
      <div className="shrink-0" style={{ width: height, height }}>
        <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={height / 2 - 10}
            innerRadius={height / 2 - 45}
            dataKey="count"
            nameKey="label"
            strokeWidth={2}
            stroke="hsl(var(--card))"
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number, name: string) => [`${value.toLocaleString('th-TH')} ราย`, name]}
            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
          />
        </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-0">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full shrink-0" style={{ background: item.color }} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold">{item.count.toLocaleString('th-TH')}</span>
              <span className="ml-1 text-xs text-muted-foreground">({typeof item.percentage === 'number' ? item.percentage.toFixed(1) : item.percentage}%)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

interface StackedBarChartProps {
  data: Array<{ district: string; normal: number; warning: number; high: number; critical: number }>
  height?: number
}

export function StackedRiskChart({ data, height = 260 }: StackedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
        <XAxis dataKey="district" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
          cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="normal" name="ปกติ" fill={COLORS.emerald} stackId="a" />
        <Bar dataKey="warning" name="เฝ้าระวัง" fill={COLORS.amber} stackId="a" />
        <Bar dataKey="high" name="ความเสี่ยงสูง" fill="#F97316" stackId="a" />
        <Bar dataKey="critical" name="วิกฤต" fill={COLORS.red} stackId="a" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

interface SimpleDonutProps {
  data: Array<{ name: string; value: number; color: string }>
  height?: number
}

export function SimpleDonutChart({ data, height = 200 }: SimpleDonutProps) {
  return (
    <div className="flex items-center gap-4">
      <ResponsiveContainer width={height} height={height}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={2} stroke="hsl(var(--card))">
            {data.map((entry, index) => <Cell key={index} fill={entry.color} />)}
          </Pie>
          <Tooltip
            formatter={(v: number) => [`${v.toLocaleString('th-TH')} ราย`]}
            contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))', background: 'hsl(var(--card))', color: 'hsl(var(--foreground))' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-col gap-2 flex-1">
        {data.map((item, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.color }} />
              <span className="text-xs text-muted-foreground">{item.name}</span>
            </div>
            <span className="text-sm font-semibold">{item.value.toLocaleString('th-TH')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
