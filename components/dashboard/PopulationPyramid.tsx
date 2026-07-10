"use client";

import { useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { formatNumber, formatPercent } from '@/lib/formatters';

interface PyramidRow {
  id: number;
  label: string;
  male: number;
  female: number;
  total: number;
}

interface PopulationPyramidProps {
  rows: PyramidRow[];
  totalPopulation: number;
}

export function PopulationPyramid({ rows, totalPopulation }: PopulationPyramidProps) {
  const [hovered, setHovered] = useState<{ side: 'male' | 'female'; id: number } | null>(null);

  // หาค่าสูงสุดระหว่างชาย/หญิง เพื่อใช้เป็นสเกลความกว้างแถบ
  const maxValue = useMemo(() => {
    let max = 0;
    for (const r of rows) {
      if (r.male > max) max = r.male;
      if (r.female > max) max = r.female;
    }
    return max || 1;
  }, [rows]);

  if (rows.length === 0) {
    return (
      <div className="rounded-lg border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        ไม่มีข้อมูลประชากรสำหรับช่วงอายุที่เลือก
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      {/* หัวตาราง */}
      <div className="mb-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-1">
        <div className="text-right text-xs font-bold text-blue-600 dark:text-blue-400">ชาย</div>
        <div className="text-center text-[11px] font-semibold text-muted-foreground">ช่วงอายุ</div>
        <div className="text-left text-xs font-bold text-pink-600 dark:text-pink-400">หญิง</div>
      </div>

      <div className="space-y-1">
        {rows.map((row) => {
          const malePctWidth = (row.male / maxValue) * 100;
          const femalePctWidth = (row.female / maxValue) * 100;
          const malePctTotal = totalPopulation ? (row.male / totalPopulation) * 100 : 0;
          const femalePctTotal = totalPopulation ? (row.female / totalPopulation) * 100 : 0;

          return (
            <div key={row.id} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              {/* ฝั่งชาย (ซ้าย) */}
              <div className="flex items-center justify-end gap-1.5">
                <span className="w-10 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
                  {formatPercent(malePctTotal, 1)}
                </span>
                <div
                  className={cn(
                    'group relative flex h-5 items-center justify-start rounded-l-md bg-blue-500/80 transition-all hover:bg-blue-500',
                    hovered?.side === 'male' && hovered.id === row.id && 'ring-2 ring-blue-300'
                  )}
                  style={{ width: `${Math.max(malePctWidth, 2)}%` }}
                  onMouseEnter={() => setHovered({ side: 'male', id: row.id })}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="px-1.5 text-[10px] font-medium text-white">
                    {formatNumber(row.male)}
                  </span>
                  {hovered?.side === 'male' && hovered.id === row.id && (
                    <PyramidTooltip
                      side="male"
                      label={row.label}
                      count={row.male}
                      pct={malePctTotal}
                    />
                  )}
                </div>
              </div>

              {/* กลาง: ช่วงอายุ */}
              <div className="w-20 shrink-0 text-center text-[10px] font-medium leading-tight text-muted-foreground">
                {row.label}
              </div>

              {/* ฝั่งหญิง (ขวา) */}
              <div className="flex items-center gap-1.5">
                <div
                  className={cn(
                    'group relative flex h-5 items-center justify-end rounded-r-md bg-pink-500/80 transition-all hover:bg-pink-500',
                    hovered?.side === 'female' && hovered.id === row.id && 'ring-2 ring-pink-300'
                  )}
                  style={{ width: `${Math.max(femalePctWidth, 2)}%` }}
                  onMouseEnter={() => setHovered({ side: 'female', id: row.id })}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span className="px-1.5 text-[10px] font-medium text-white">
                    {formatNumber(row.female)}
                  </span>
                  {hovered?.side === 'female' && hovered.id === row.id && (
                    <PyramidTooltip
                      side="female"
                      label={row.label}
                      count={row.female}
                      pct={femalePctTotal}
                    />
                  )}
                </div>
                <span className="w-10 shrink-0 text-left text-[10px] tabular-nums text-muted-foreground">
                  {formatPercent(femalePctTotal, 1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* คำอธิบายสี */}
      <div className="mt-3 flex items-center justify-center gap-4 border-t pt-2 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-500" /> ชาย
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-sm bg-pink-500" /> หญิง
        </span>
        <span>ตัวเลขในแถบ = จำนวนคน | ด้านข้าง = % ของประชากรทั้งหมด</span>
      </div>
    </div>
  );
}

function PyramidTooltip({
  side,
  label,
  count,
  pct,
}: {
  side: 'male' | 'female';
  label: string;
  count: number;
  pct: number;
}) {
  const isMale = side === 'male';
  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-full z-20 mb-1 w-max rounded-md border bg-popover px-2.5 py-1.5 text-xs shadow-lg',
        isMale ? 'right-0' : 'left-0'
      )}
    >
      <p className="font-semibold text-foreground">{label}</p>
      <p className={cn('font-medium', isMale ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400')}>
        {isMale ? 'ชาย' : 'หญิง'}: {formatNumber(count)} คน
      </p>
      <p className="text-muted-foreground">{formatPercent(pct, 2)} ของประชากรทั้งหมด</p>
    </div>
  );
}
