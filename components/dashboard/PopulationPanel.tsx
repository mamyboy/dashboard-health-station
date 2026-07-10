"use client";

import { useMemo, useState } from 'react';
import { Users, User, UserRound, MapPinned } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { PopulationPyramid } from '@/components/dashboard/PopulationPyramid';
import { PopulationRecord, PopulationSummary } from '@/types/health-station';
import { formatNumber } from '@/lib/formatters';
import { cn } from '@/lib/utils';

interface HealthStationTitleItem {
  serviceUnit: string;
  village: string;
}

interface PopulationPanelProps {
  records: PopulationRecord[];
  summary: PopulationSummary;
  healthStationTitle?: HealthStationTitleItem[] | null;
}

export function PopulationPanel({ records, summary, healthStationTitle }: PopulationPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="surface-card overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-emerald-50 via-teal-50/70 to-cyan-50/70 px-4 py-3 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-cyan-950/20">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <Users className="h-4 w-4" />
          </span>
          <div>
            <span className="text-sm font-bold">ข้อมูลประชากร (Sheet Pop)</span>
            <p className="text-[11px] text-muted-foreground">แปลผันตามตัวกรองหลัก</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8 gap-1 rounded-md text-xs">
            {expanded ? 'ซ่อน' : 'แสดง'}
          </Button>
        </div>
      </div>

      {/* Title แจ้งเตือน Health Station ที่ถูกกรอง — แยกแถวเต็มความกว้างให้เห็นชัดเจน */}
      {healthStationTitle && healthStationTitle.length > 0 && (
        <div className="border-b border-emerald-200/60 bg-emerald-500/10 px-4 py-2.5 dark:border-emerald-500/20">
          <div className="flex items-start gap-2">
            <MapPinned className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-300" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700/80 dark:text-emerald-300/80">
                Health Station ที่เลือก
              </p>
              <div className="mt-1 flex flex-col gap-1">
                {healthStationTitle.map((t, i) => (
                  <span key={i} className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 dark:text-emerald-200">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    {t.serviceUnit} <span className="font-medium text-emerald-600/80 dark:text-emerald-300/80">— {t.village}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {expanded && (
        <div className="space-y-5 p-4">
          {/* KPI Row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <KpiCard
              title="ประชากรรวม (TYPEAREA 1,3)"
              value={formatNumber(summary.total)}
              subtitle={`ชาย ${formatNumber(summary.maleTotal)} | หญิง ${formatNumber(summary.femaleTotal)}`}
              icon={Users}
              iconBg="linear-gradient(135deg,#10B981,#059669)"
              accentColor="#10B981"
              cardTint="rgba(16,185,129,0.04)"
            />
            <KpiCard
              title="ชาย"
              value={formatNumber(summary.maleTotal)}
              subtitle="ผู้ชายทุกช่วงอายุ"
              icon={User}
              iconBg="linear-gradient(135deg,#3B82F6,#1D4ED8)"
              accentColor="#3B82F6"
              cardTint="rgba(59,130,246,0.04)"
            />
            <KpiCard
              title="หญิง"
              value={formatNumber(summary.femaleTotal)}
              subtitle="ผู้หญิงทุกช่วงอายุ"
              icon={UserRound}
              iconBg="linear-gradient(135deg,#EC4899,#DB2777)"
              accentColor="#EC4899"
              cardTint="rgba(236,72,153,0.04)"
            />
          </div>

          {/* Population Pyramid */}
          {summary.byAgeGroup.length > 0 && (
            <div className="rounded-lg border border-border/60 bg-white/40 p-4 dark:bg-white/5">
              <p className="mb-3 text-xs font-semibold text-muted-foreground">พีระมิดประชากรตามช่วงอายุ</p>
              <PopulationPyramid rows={summary.byAgeGroup} totalPopulation={summary.total} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
