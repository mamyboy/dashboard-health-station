"use client";

import { useCallback, useMemo, useState } from 'react';
import {
  ClipboardList, ClipboardCheck, Building2,
  RefreshCw, Stethoscope, AlertTriangle,
  HeartPulse, Droplets, Database, MapPinned, Gauge, Layers3,
  ShieldCheck, Hourglass, BarChart3, FlaskConical,
} from 'lucide-react';
import { KpiCard, BentoCard } from '@/components/dashboard/KpiCard';
import { DonutRiskChart, BarComparisonChart } from '@/components/charts/Charts';
import { FilterBar } from '@/components/filters/FilterBar';
import { PingPongDetailCard } from '@/components/dashboard/PingPongDetailCard';
import { AggregatedRecord, AggregatedFilterState, ProgramType } from '@/types/health-station';
import { filterAggregated, sumRecords, groupByDistrict, groupBySubdistrict, groupByVillage } from '@/lib/calculations';
import { formatNumber, formatPercent, PING_PONG_COLORS, SCREENING_STATUS_COLORS } from '@/lib/formatters';
import { cn } from '@/lib/utils';

type Tab = ProgramType;

interface Props {
  initialDmData: AggregatedRecord[];
  initialHtData: AggregatedRecord[];
}

export function DashboardClient({ initialDmData, initialHtData }: Props) {
  const [tab, setTab]     = useState<Tab>('dm');
  const [dmData, setDmData] = useState<AggregatedRecord[]>(initialDmData);
  const [htData, setHtData] = useState<AggregatedRecord[]>(initialHtData);
  const [filters, setFilters] = useState<Partial<AggregatedFilterState>>({});
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  const handleTabChange = (t: Tab) => { setTab(t); setFilters({}); };

  // รีเฟรชข้อมูลจาก Google Sheet โดยตรงผ่าน API route
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const [dmRes, htRes] = await Promise.all([
        fetch(`/api/sheet?program=dm&t=${Date.now()}`, { cache: 'no-store' }),
        fetch(`/api/sheet?program=ht&t=${Date.now()}`, { cache: 'no-store' }),
      ]);
      if (!dmRes.ok || !htRes.ok) throw new Error('fetch failed');
      const [dm, ht]: [AggregatedRecord[], AggregatedRecord[]] = await Promise.all([
        dmRes.json(),
        htRes.json(),
      ]);
      setDmData(dm);
      setHtData(ht);
      setLastUpdated(new Date());
      setFilters({});
    } catch {
      setError('ไม่สามารถรีเฟรชข้อมูลได้ กรุณาลองใหม่');
    } finally {
      setRefreshing(false);
    }
  }, []);

  const allRecords  = tab === 'dm' ? dmData : htData;
  const filtered    = useMemo(() => filterAggregated(allRecords, filters), [allRecords, filters]);
  const summary     = useMemo(() => sumRecords(filtered), [filtered]);
  const byDistrict  = useMemo(() => groupByDistrict(filtered), [filtered]);
  const isSubdistrictFiltered = !!(filters.subdistrict && filters.subdistrict !== 'all');
  const bySubdistrict = useMemo(() => groupBySubdistrict(filtered).slice(0, 50), [filtered]);
  const byVillage     = useMemo(() => groupByVillage(filtered), [filtered]);
  const tableRows     = isSubdistrictFiltered ? byVillage : bySubdistrict.slice(0, 15);

  const screeningDist = useMemo(() => {
    const t = summary.total || 1;
    return [
      { label: 'ปกติ',       count: summary.normal,    percentage: (summary.normal    / t) * 100, color: SCREENING_STATUS_COLORS.normal.color    },
      { label: 'เสี่ยง',     count: summary.risk,      percentage: (summary.risk      / t) * 100, color: SCREENING_STATUS_COLORS.risk.color      },
      { label: 'สงสัยป่วย', count: summary.suspected, percentage: (summary.suspected / t) * 100, color: SCREENING_STATUS_COLORS.suspected.color },
    ];
  }, [summary]);

  const pingPongDist = useMemo(() => {
    const keys = tab === 'dm' ? PING_PONG_COLORS : PING_PONG_COLORS.filter(p => p.key !== 'black');
    const pingTotal = keys.reduce((s, p) => s + (summary[p.key as keyof typeof summary] as number), 0) || 1;
    return keys.map(p => ({
      label: p.label,
      count: summary[p.key as keyof typeof summary] as number,
      percentage: ((summary[p.key as keyof typeof summary] as number) / pingTotal) * 100,
      color: p.color,
    }));
  }, [summary, tab]);

  const totalPatients = useMemo(() =>
    summary.darkGreen + summary.yellow + summary.orange + summary.red + (tab === 'dm' ? summary.black : 0),
  [summary, tab]);

  const barData = byDistrict.map(d => ({
    district: d.district,
    total: d.total,
    atRisk: d.risk + d.suspected,
  }));

  const isDM = tab === 'dm';
  const riskRate = summary.total ? ((summary.risk + summary.suspected) / summary.total) * 100 : 0;
  const screenedShare = summary.total + summary.notScreened
    ? (summary.total / (summary.total + summary.notScreened)) * 100
    : 0;
  const programMeta = isDM
    ? {
        title: 'เงื่อนไข DM — เบาหวาน',
        label: 'Diabetes Monitoring',
        icon: Droplets,
        gradient: 'from-blue-700 via-cyan-600 to-sky-500',
        soft: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
      }
    : {
        title: 'เงื่อนไข HT — ความดันโลหิตสูง',
        label: 'Hypertension Tracking',
        icon: HeartPulse,
        gradient: 'from-blue-700 via-cyan-600 to-sky-500',
        soft: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
      };
  const ProgramIcon = programMeta.icon;
  const tabOptions = [
    {
      value: 'dm' as Tab,
      label: 'DM',
      description: 'เบาหวาน',
      icon: Droplets,
      activeClass: 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25 ring-1 ring-sky-300/40',
      inactiveClass: 'text-sky-700 hover:bg-sky-500/10 hover:text-sky-800 dark:text-sky-300 dark:hover:bg-sky-400/10',
      iconClass: 'text-sky-600 dark:text-sky-300',
    },
    {
      value: 'ht' as Tab,
      label: 'HT',
      description: 'ความดันโลหิตสูง',
      icon: HeartPulse,
      activeClass: 'bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-md shadow-rose-500/25 ring-1 ring-rose-300/40',
      inactiveClass: 'text-rose-700 hover:bg-rose-500/10 hover:text-rose-800 dark:text-rose-300 dark:hover:bg-rose-400/10',
      iconClass: 'text-rose-600 dark:text-rose-300',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Header row: Tab + Refresh */}
      <div className="surface-card overflow-hidden rounded-lg border">
        <div className={cn('relative overflow-hidden bg-gradient-to-r px-5 py-5 text-slate-50', programMeta.gradient)}>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/45 via-slate-900/30 to-slate-950/35" />
          <div className="relative flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/22 ring-1 ring-white/35">
                <ProgramIcon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/90">{programMeta.label}</p>
                <h2 className="mt-1 truncate text-2xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">{programMeta.title}</h2>
              </div>
            </div>

            <div className="flex-1" />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t bg-white/75 px-4 py-3 backdrop-blur dark:bg-slate-950/45 md:flex-row md:items-center">
          <div className="inline-flex w-full rounded-lg border border-border/70 bg-muted/50 p-1 shadow-inner md:w-auto">
            {tabOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleTabChange(option.value)}
                className={cn(
                  'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition-all md:flex-none',
                  tab === option.value
                    ? option.activeClass
                    : option.inactiveClass
                )}
              >
                <option.icon className={cn('h-4 w-4', tab === option.value ? 'text-white' : option.iconClass)} />
                <span>{option.label}</span>
                <span className="hidden text-xs font-medium opacity-70 sm:inline">{option.description}</span>
              </button>
            ))}
          </div>

          <div className="flex-1" />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Filter — options สร้างจากข้อมูลจริงจาก sheet */}
      <FilterBar records={allRecords} filters={filters} onChange={setFilters} />

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        <div className="animate-fade-up">
          <KpiCard
            title="คัดกรองแล้วทั้งหมด"
            value={formatNumber(summary.total)}
            subtitle="ปกติ + เสี่ยง + สงสัยป่วย"
            icon={ClipboardList}
            iconBg="linear-gradient(135deg,#3B82F6,#1D4ED8)"
            accentColor="#3B82F6"
            cardTint="rgba(59,130,246,0.04)"
          />
        </div>
        <div className="animate-fade-up-delay-1">
          <KpiCard
            title="ยังไม่ได้คัดกรอง"
            value={formatNumber(summary.notScreened)}
            subtitle="ต้องดำเนินการ"
            icon={Hourglass}
            iconBg="linear-gradient(135deg,#6366F1,#4338CA)"
            accentColor="#6366F1"
            cardTint="rgba(99,102,241,0.04)"
          />
        </div>
        <div className="animate-fade-up-delay-2">
          <KpiCard
            title="หน่วยบริการ"
            value={formatNumber(summary.serviceUnitCount)}
            subtitle="ทั้งหมด"
            icon={Building2}
            iconBg="linear-gradient(135deg,#0EA5E9,#0284C7)"
            accentColor="#0EA5E9"
            cardTint="rgba(14,165,233,0.04)"
          />
        </div>
        <div className="animate-fade-up-delay-3">
          <KpiCard
            title="Health Station"
            value={formatNumber(summary.stationCount)}
            subtitle="Y = เป็น Healthstation"
            icon={MapPinned}
            iconBg={isDM ? 'linear-gradient(135deg,#38BDF8,#0284C7)' : 'linear-gradient(135deg,#34D399,#059669)'}
            accentColor={isDM ? '#38BDF8' : '#34D399'}
            cardTint={isDM ? 'rgba(56,189,248,0.04)' : 'rgba(52,211,153,0.04)'}
          />
        </div>
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-6">
        <div className="animate-fade-up-delay-1">
          <KpiCard
            title="ปกติ"
            value={formatNumber(summary.normal)}
            subtitle={formatPercent(summary.total ? (summary.normal / summary.total) * 100 : 0)}
            icon={ShieldCheck}
            iconBg="linear-gradient(135deg,#10B981,#059669)"
            accentColor="#10B981"
            cardTint="rgba(16,185,129,0.04)"
          />
        </div>
        <div className="animate-fade-up-delay-2">
          <KpiCard
            title="เสี่ยง"
            value={formatNumber(summary.risk)}
            subtitle={`${formatPercent(summary.total ? (summary.risk / summary.total) * 100 : 0)} (รวม สงสัยป่วย)`}
            icon={AlertTriangle}
            iconBg="linear-gradient(135deg,#F59E0B,#D97706)"
            accentColor="#F59E0B"
            cardTint="rgba(245,158,11,0.04)"
          />
        </div>
        <div className="animate-fade-up-delay-3">
          <KpiCard
            title="สงสัยป่วย"
            value={formatNumber(summary.suspected)}
            subtitle={`${formatPercent(summary.total ? (summary.suspected / summary.total) * 100 : 0)} (subset เสี่ยง)`}
            icon={FlaskConical}
            iconBg="linear-gradient(135deg,#F97316,#DC2626)"
            accentColor="#F97316"
            cardTint="rgba(249,115,22,0.04)"
          />
        </div>
        <div className="animate-fade-up-delay-4">
          <KpiCard
            title={isDM ? 'กลุ่มป่วย (สี 0–3+ดำ)' : 'กลุ่มป่วย (สี 0–3)'}
            value={formatNumber(totalPatients)}
            subtitle={`${formatPercent(summary.total ? (totalPatients / summary.total) * 100 : 0)} ของคัดกรอง`}
            icon={Stethoscope}
            iconBg="linear-gradient(135deg,#EF4444,#B91C1C)"
            accentColor="#EF4444"
            cardTint="rgba(239,68,68,0.04)"
          />
        </div>
        <div className="animate-fade-up-delay-5">
          <KpiCard
            title="อัตราเสี่ยงรวม"
            value={formatPercent(summary.total ? ((summary.risk + summary.suspected) / summary.total) * 100 : 0)}
            subtitle="(เสี่ยง + สงสัยป่วย) / คัดกรอง"
            icon={BarChart3}
            iconBg="linear-gradient(135deg,#F43F5E,#BE123C)"
            accentColor="#F43F5E"
            cardTint="rgba(244,63,94,0.04)"
          />
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-fade-up-delay-2">
        <BentoCard className="lg:col-span-2" title="เปรียบเทียบรายอำเภอ" description="จำนวนคัดกรองและกลุ่มเสี่ยงรวม">
          <BarComparisonChart data={barData} height={260} />
        </BentoCard>
        <BentoCard title="สถานะการคัดกรอง" description="ปกติ / เสี่ยง / สงสัยป่วย">
          <DonutRiskChart data={screeningDist} height={190} />
        </BentoCard>
      </div>



      {/* ปิงปองจราจร 7 สี — รายละเอียด + ข้อมูลจริง */}
      <PingPongDetailCard summary={summary} program={tab} />

      {/* Subdistrict / Village Table */}
      <BentoCard
        title={isSubdistrictFiltered ? 'ตารางสรุปรายหมู่บ้าน' : 'ตารางสรุปรายตำบล'}
        description={isSubdistrictFiltered
          ? `${byVillage.length} หมู่บ้าน ใน ${filters.subdistrict} (${formatNumber(filtered.length)} แถวที่กรองแล้ว)`
          : `Top 15 เรียงตามจำนวนคัดกรอง (${formatNumber(filtered.length)} แถวที่กรองแล้ว)`
        }
      >
        <div className="overflow-x-auto rounded-xl border border-cyan-500/15 bg-gradient-to-br from-cyan-50/70 via-card to-emerald-50/55 shadow-sm dark:border-cyan-400/15 dark:from-cyan-950/20 dark:via-card dark:to-emerald-950/15">
          <table className="w-full text-sm">
            <thead>
              <tr className="sticky top-0 border-b border-blue-300/20 bg-gradient-to-r from-blue-950 via-sky-900 to-indigo-950 shadow-md">
                {[
                  { key: '#', label: '#', width: 'w-10' },
                  { key: 'อำเภอ', label: 'อำเภอ', width: 'w-32' },
                  { key: 'col3', label: isSubdistrictFiltered ? 'หมู่บ้าน' : 'ตำบล', width: 'w-36' },
                  { key: 'คัดกรอง', label: 'คัดกรอง', width: 'w-24', align: 'right' },
                  { key: 'ปกติ', label: 'ปกติ', width: 'w-20', align: 'right' },
                  { key: 'เสี่ยง', label: 'เสี่ยง', width: 'w-20', align: 'right' },
                  { key: 'สงสัยป่วย', label: 'สงสัยป่วย', width: 'w-24', align: 'right' },
                  { key: 'ยังไม่คัดกรอง', label: 'ยังไม่คัดกรอง', width: 'w-28', align: 'right' },
                  { key: 'อัตราเสี่ยง', label: 'อัตราเสี่ยง', width: 'w-28', align: 'right' },
                ].map(h => (
                  <th
                    key={h.key}
                    className={cn(
                      'whitespace-nowrap px-3 py-3.5 text-left text-xs font-black text-white first:pl-4 last:pr-4',
                      h.width,
                      h.align === 'right' && 'text-right',
                    )}
                  >
                    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-1 shadow-sm ring-1 ring-white/15 backdrop-blur-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.65)]">
                      {h.label}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/10 bg-white/58 backdrop-blur-sm dark:divide-cyan-100/10 dark:bg-slate-950/28">
              {tableRows.map((row, i) => {
                const rateRisk = row.total ? ((row.risk + row.suspected) / row.total) * 100 : 0;
                const riskLevel = rateRisk >= 20 ? 'high' : rateRisk >= 10 ? 'medium' : 'low';
                const riskColors = {
                  high: 'border-red-500/25 bg-red-500/10 text-red-600 dark:text-red-300',
                  medium: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
                  low: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
                };
                const riskDots = {
                  high: '#EF4444',
                  medium: '#F59E0B',
                  low: '#10B981',
                };
                const riskLabels = { high: 'สูง', medium: 'ปานกลาง', low: 'ต่ำ' };
                const col3Label = isSubdistrictFiltered
                  ? (row as typeof byVillage[0]).village
                  : (row as typeof bySubdistrict[0]).subdistrict;
                const rowKey = isSubdistrictFiltered
                  ? `${row.district}-${(row as typeof byVillage[0]).village}-${i}`
                  : `${row.district}-${(row as typeof bySubdistrict[0]).subdistrict}`;

                return (
                  <tr
                    key={rowKey}
                    className="transition-colors duration-150 odd:bg-cyan-500/[0.045] even:bg-white/35 hover:bg-emerald-500/10 dark:odd:bg-cyan-400/[0.055] dark:even:bg-white/[0.025] dark:hover:bg-emerald-400/10"
                  >
                    <td className="py-3 px-3 text-xs font-mono text-muted-foreground/70">{i + 1}</td>
                    <td className="py-2.5 px-3 text-xs text-foreground/80">{row.district}</td>
                    <td className="py-2.5 px-3 text-xs font-medium text-foreground">{col3Label}</td>
                    <td className="py-2.5 px-3 text-xs font-bold text-right text-foreground">{formatNumber(row.total)}</td>
                    <td className="py-2.5 px-3 text-xs font-medium text-right text-emerald-600 dark:text-emerald-400">{formatNumber(row.normal)}</td>
                    <td className="py-2.5 px-3 text-xs font-medium text-right text-amber-600 dark:text-amber-400">{formatNumber(row.risk)}</td>
                    <td className="py-2.5 px-3 text-xs font-medium text-right text-red-600 dark:text-red-400">{formatNumber(row.suspected)}</td>
                    <td className="py-2.5 px-3 text-xs text-right text-slate-500 dark:text-slate-400">{formatNumber(row.notScreened)}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold border ${riskColors[riskLevel]}`}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: riskDots[riskLevel] }} />
                        {formatPercent(rateRisk)}
                        <span className="hidden sm:inline">{riskLabels[riskLevel]}</span>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {tableRows.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted/50">
                <svg className="h-6 w-6 text-muted-foreground/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-foreground">ไม่พบข้อมูลที่ตรงตามตัวกรอง</p>
              <p className="mt-1 text-xs text-muted-foreground">ลองปรับตัวกรองหรือรีเฟรชข้อมูลใหม่</p>
            </div>
          )}
        </div>
      </BentoCard>

    </div>
  );
}
