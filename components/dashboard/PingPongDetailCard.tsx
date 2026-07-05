"use client";

import { AggregateSummary, ProgramType } from '@/types/health-station';
import { formatNumber, formatPercent } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Activity, CheckCircle2, ClipboardList, ListChecks } from 'lucide-react';

/* ───────────────────── ข้อมูลเกณฑ์แต่ละสี ───────────────────── */

interface ColorMeta {
  key: keyof AggregateSummary | 'risk_suspected';
  label: string;
  symbol: string;
  bg: string;       // สีพื้นหลังวงกลม (CSS color)
  text: string;     // สีตัวเลขในวงกลม
  badge: string;    // Tailwind class สำหรับ badge count
  criteria: string[];
  actions: string[];
}

const DM_COLORS: ColorMeta[] = [
  {
    key: 'normal',
    label: 'ปกติ',
    symbol: '',
    bg: '#F5F0E8',
    text: '#6B7280',
    badge: 'bg-gray-100 text-gray-700',
    criteria: ['FBS ≤ 100 mg/dl'],
    actions: [
      'เน้นกิจกรรม 3อ อาหาร ออกกำลังกาย อารมณ์',
      'ลด/เลิกบุหรี่และเครื่องดื่มแอลกอฮอล์',
    ],
  },
  {
    key: 'risk_suspected',
    label: 'กลุ่มเสี่ยง / สงสัยป่วย',
    symbol: '±',
    bg: '#86EFAC',
    text: '#14532D',
    badge: 'bg-green-100 text-green-800',
    criteria: ['FBS = 100–125 mg/dl'],
    actions: [
      'เน้นกิจกรรม 3อ อาหาร ออกกำลังกาย อารมณ์',
      'ลด/เลิกบุหรี่และเครื่องดื่มแอลกอฮอล์',
      'วัดความดันโลหิตทุกเดือน',
      'ตรวจเบาหวานทุก 1-3 เดือน',
    ],
  },
  {
    key: 'darkGreen',
    label: 'กลุ่มป่วย สี 0',
    symbol: '0',
    bg: '#166534',
    text: '#FFFFFF',
    badge: 'bg-emerald-900 text-emerald-100',
    criteria: ['FBS ≤ 125 mg/dl'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว',
      'รับประทานยาต่อเนื่อง',
      'ลดการบริโภคน้ำตาลและอาหารมัน เค็ม',
    ],
  },
  {
    key: 'yellow',
    label: 'กลุ่มป่วย สี 1',
    symbol: '1',
    bg: '#EAB308',
    text: '#FFFFFF',
    badge: 'bg-yellow-100 text-yellow-800',
    criteria: ['FBS = 126–154 mg/dl', 'HbA1C < 7%'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว สีเขียว',
      'ป้องกันภาวะแทรกซ้อน เช่น ตรวจตา เท้า ปัสสาวะ',
      'อย่างน้อยปีละ 1 ครั้ง',
    ],
  },
  {
    key: 'orange',
    label: 'กลุ่มป่วย สี 2',
    symbol: '2',
    bg: '#EA580C',
    text: '#FFFFFF',
    badge: 'bg-orange-100 text-orange-800',
    criteria: ['FBS = 155–182 mg/dl', 'HbA1C 7–8%'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว สีเขียว สีเหลือง',
      'พบแพทย์ตามนัด หรือเมื่อมีอาการผิดปกติ',
      'ได้รับการเยี่ยมบ้าน',
    ],
  },
  {
    key: 'red',
    label: 'กลุ่มป่วย สี 3',
    symbol: '3',
    bg: '#DC2626',
    text: '#FFFFFF',
    badge: 'bg-red-100 text-red-800',
    criteria: ['FBS ≥ 183 mg/dl', 'HbA1C > 8%'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว สีเขียว สีเหลือง สีส้ม',
    ],
  },
  {
    key: 'black',
    label: 'กลุ่มป่วยมีโรคแทรกซ้อน',
    symbol: '●',
    bg: '#1E293B',
    text: '#FFFFFF',
    badge: 'bg-slate-800 text-slate-100',
    criteria: ['โรคหัวใจ / หลอดเลือด', 'สมอง / ไต / ตา / เท้า'],
    actions: [
      'เมื่อเกิดภาวะแทรกซ้อนต้องส่งโรงพยาบาล',
      'เพื่อลดความรุนแรงและโอกาสเสียชีวิต',
    ],
  },
];

const HT_COLORS: ColorMeta[] = [
  {
    key: 'normal',
    label: 'ปกติ',
    symbol: '',
    bg: '#F5F0E8',
    text: '#6B7280',
    badge: 'bg-gray-100 text-gray-700',
    criteria: ['BP ≤ 120/80 mmHg'],
    actions: [
      'เน้นกิจกรรม 3อ อาหาร ออกกำลังกาย อารมณ์',
      'ลด/เลิกบุหรี่และเครื่องดื่มแอลกอฮอล์',
    ],
  },
  {
    key: 'risk_suspected',
    label: 'กลุ่มเสี่ยง / สงสัยป่วย',
    symbol: '±',
    bg: '#86EFAC',
    text: '#14532D',
    badge: 'bg-green-100 text-green-800',
    criteria: ['BP = 120/80 – 139/89 mmHg'],
    actions: [
      'เน้นกิจกรรม 3อ อาหาร ออกกำลังกาย อารมณ์',
      'ลด/เลิกบุหรี่และเครื่องดื่มแอลกอฮอล์',
      'วัดความดันโลหิตทุกเดือน',
    ],
  },
  {
    key: 'darkGreen',
    label: 'กลุ่มป่วย สี 0',
    symbol: '0',
    bg: '#166534',
    text: '#FFFFFF',
    badge: 'bg-emerald-900 text-emerald-100',
    criteria: ['BP ≤ 139 / 89 mmHg'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว',
      'รับประทานยาต่อเนื่อง',
      'ลดการบริโภคอาหารมัน เค็ม',
    ],
  },
  {
    key: 'yellow',
    label: 'กลุ่มป่วย สี 1',
    symbol: '1',
    bg: '#EAB308',
    text: '#FFFFFF',
    badge: 'bg-yellow-100 text-yellow-800',
    criteria: ['BP = 140/90 – 159/99 mmHg'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว สีเขียว',
      'ป้องกันภาวะแทรกซ้อน ตรวจตา เท้า ปัสสาวะ',
    ],
  },
  {
    key: 'orange',
    label: 'กลุ่มป่วย สี 2',
    symbol: '2',
    bg: '#EA580C',
    text: '#FFFFFF',
    badge: 'bg-orange-100 text-orange-800',
    criteria: ['BP = 160/100 – 179/109 mmHg'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว สีเขียว สีเหลือง',
      'พบแพทย์ตามนัด หรือเมื่อมีอาการผิดปกติ',
      'ได้รับการเยี่ยมบ้าน',
    ],
  },
  {
    key: 'red',
    label: 'กลุ่มป่วย สี 3',
    symbol: '3',
    bg: '#DC2626',
    text: '#FFFFFF',
    badge: 'bg-red-100 text-red-800',
    criteria: ['BP ≥ 180/110 mmHg'],
    actions: [
      'ปฏิบัติตัวเช่นสีขาว สีเขียว สีเหลือง สีส้ม',
    ],
  },
];

/* ───────────────────── ฟังก์ชันช่วย ───────────────────── */

function getCount(summary: AggregateSummary, key: string): number {
  if (key === 'risk_suspected') return summary.risk + summary.suspected;
  return (summary[key as keyof AggregateSummary] as number) ?? 0;
}

/* ───────────────────── Component ───────────────────── */

interface Props {
  summary: AggregateSummary;
  program: ProgramType;
}

export function PingPongDetailCard({ summary, program }: Props) {
  const colors = program === 'dm' ? DM_COLORS : HT_COLORS;
  const totalAll = colors.reduce((s, c) => s + getCount(summary, c.key), 0) || 1;
  const programLabel = program === 'dm' ? 'เบาหวาน' : 'ความดัน';

  return (
    <div className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm">
      {/* Header */}
      <div className="relative overflow-hidden border-b px-6 py-5">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-cyan-950 to-emerald-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_35%,rgba(34,211,238,0.22),transparent_34%),radial-gradient(circle_at_82%_45%,rgba(16,185,129,0.18),transparent_38%)]" />
        <div className="relative flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/18 ring-1 ring-white/30 backdrop-blur-sm">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black tracking-wide text-primary-foreground">
                ปิงปองจราจร {program === 'dm' ? '7' : '6'} สี
              </h2>
              <span className="rounded-full bg-white/18 px-2.5 py-0.5 text-[11px] font-bold text-primary-foreground/95 ring-1 ring-white/25">
                {programLabel}
              </span>
            </div>
            <p className="mt-0.5 text-xs text-primary-foreground/75">คัดกรองและจัดกลุ่มความรุนแรงตามเกณฑ์สีสัญญาณจราจร</p>
          </div>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="overflow-x-auto bg-muted/20 p-3">
        <div
          className="grid min-w-[780px] gap-2.5"
          style={{ gridTemplateColumns: `repeat(${colors.length}, 1fr)` }}
        >
          {colors.map((c) => {
            const count = getCount(summary, c.key);
            const pct   = (count / totalAll) * 100;
            const isPatient = c.key !== 'normal' && c.key !== 'risk_suspected';
            const isBlack = c.key === 'black';

            return (
              <div
                key={c.key}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
              >
                {/* Accent bar top */}
                <div className="h-1 w-full" style={{ background: c.bg }} />

                {/* Group label */}
                <div className="px-3 pt-2.5 text-center">
                  <span className={cn(
                    'inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest',
                    !isPatient
                      ? 'border-primary/20 bg-primary/10 text-primary dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-200'
                      : isBlack
                        ? 'border-slate-500/20 bg-slate-500/10 text-slate-600 dark:text-slate-300'
                        : 'border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300',
                  )}>
                    {!isPatient ? 'คัดกรอง' : isBlack ? 'แทรกซ้อน' : 'กลุ่มป่วย'}
                  </span>
                </div>

                {/* Circle */}
                <div className="flex flex-col items-center gap-2 px-3 py-3">
                  <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-full text-lg font-black shadow-lg ring-4 ring-white/80 transition-transform duration-200 group-hover:scale-105 dark:ring-white/10"
                    style={{ background: c.bg, color: c.text }}
                  >
                    {c.symbol}
                    {/* glow */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-40"
                      style={{ background: c.bg }}
                    />
                  </div>
                  <p className="text-center text-[11px] font-bold leading-tight text-foreground">{c.label}</p>
                </div>

                {/* Count */}
                <div className="px-3 pb-2 text-center">
                  <p className="text-lg font-black tracking-tight text-foreground">{formatNumber(count)}</p>
                  <p className="text-[10px] text-muted-foreground">ราย · {formatPercent(pct)}</p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{ width: `${Math.min(pct, 100)}%`, background: c.bg }}
                    />
                  </div>
                </div>

                <div className="mx-3 border-t border-dashed border-border/60" />

                {/* Criteria */}
                <div className="px-3 py-2.5">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <div className="flex h-4 w-4 items-center justify-center rounded bg-muted">
                      <ClipboardList className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">เกณฑ์</p>
                  </div>
                  <ul className="space-y-1">
                    {c.criteria.map((cr) => (
                      <li key={cr} className="flex items-start gap-1 text-[10px] leading-snug text-foreground/80">
                        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.bg }} />
                        {cr}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mx-3 border-t border-dashed border-border/60" />

                {/* Actions */}
                <div className="flex-1 px-3 py-2.5 pb-4">
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <div className="flex h-4 w-4 items-center justify-center rounded bg-muted">
                      <ListChecks className="h-2.5 w-2.5 text-muted-foreground" />
                    </div>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">การดำเนินงาน</p>
                  </div>
                  <ul className="space-y-1">
                    {c.actions.map((a) => (
                      <li key={a} className="flex items-start gap-1 text-[10px] leading-snug text-foreground/80">
                        <CheckCircle2 className="mt-0.5 h-2.5 w-2.5 shrink-0 text-muted-foreground/60" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-t bg-gradient-to-r from-muted/35 via-card to-accent/25 px-6 py-3 text-xs text-muted-foreground dark:from-muted/20 dark:via-card dark:to-accent/10">
        <span>รวมทั้งหมด <strong className="text-foreground">{formatNumber(summary.total + summary.notScreened)}</strong> ราย</span>
        <span className="text-border">|</span>
        <span>คัดกรองแล้ว <strong className="text-primary">{formatNumber(summary.total)}</strong> ราย</span>
        <span className="text-border">|</span>
        <span>ยังไม่คัดกรอง <strong className="text-muted-foreground">{formatNumber(summary.notScreened)}</strong> ราย</span>
      </div>
    </div>
  );
}
