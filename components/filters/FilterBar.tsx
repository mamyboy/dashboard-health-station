"use client";

import { useMemo, useState } from 'react';
import { BadgeCheck, ChevronDown, Filter, Home, Hospital, Map, MapPinned, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AggregatedRecord, AggregatedFilterState } from '@/types/health-station';
import { cn } from '@/lib/utils';

interface FilterBarProps {
  records: AggregatedRecord[];
  filters: Partial<AggregatedFilterState>;
  onChange: (f: Partial<AggregatedFilterState>) => void;
  compact?: boolean;
}

export function FilterBar({ records, filters, onChange, compact = false }: FilterBarProps) {
  const [expanded, setExpanded] = useState(true);

  const hasActive = Object.values(filters).some(v => v && v !== 'all');
  const clear = () => onChange({});

  const set = (key: keyof AggregatedFilterState, value: string) => {
    const next = { ...filters, [key]: value };
    if (key === 'district')    { next.subdistrict = 'all'; next.serviceUnit = 'all'; next.village = 'all'; }
    if (key === 'subdistrict') { next.serviceUnit = 'all'; next.village = 'all'; }
    onChange(next);
  };

  const districtOptions = useMemo(() =>
    [...new Set(records.map(r => r.district))].sort(), [records]);

  const subdistrictOptions = useMemo(() => {
    const base = filters.district && filters.district !== 'all'
      ? records.filter(r => r.district === filters.district)
      : records;
    return [...new Set(base.map(r => r.subdistrict))].sort();
  }, [records, filters.district]);

  const serviceUnitOptions = useMemo(() => {
    const base = records.filter(r => {
      if (filters.district    && filters.district    !== 'all' && r.district    !== filters.district)    return false;
      if (filters.subdistrict && filters.subdistrict !== 'all' && r.subdistrict !== filters.subdistrict) return false;
      return true;
    });
    const seen = new Set<string>();
    const opts: { value: string; label: string }[] = [];
    base.forEach(r => {
      if (!seen.has(r.serviceUnitCode)) {
        seen.add(r.serviceUnitCode);
        opts.push({ value: r.serviceUnit, label: r.serviceUnit });
      }
    });
    return opts.sort((a, b) => a.label.localeCompare(b.label, 'th'));
  }, [records, filters.district, filters.subdistrict]);

  const villageOptions = useMemo(() => {
    const base = records.filter(r => {
      if (filters.district    && filters.district    !== 'all' && r.district    !== filters.district)    return false;
      if (filters.subdistrict && filters.subdistrict !== 'all' && r.subdistrict !== filters.subdistrict) return false;
      if (filters.serviceUnit && filters.serviceUnit !== 'all' && r.serviceUnit !== filters.serviceUnit) return false;
      return true;
    });
    return [...new Set(base.map(r => r.village))].sort();
  }, [records, filters.district, filters.subdistrict, filters.serviceUnit]);

  const healthStationOptions = useMemo(() => {
    const base = records.filter(r => {
      if (filters.district    && filters.district    !== 'all' && r.district    !== filters.district)    return false;
      if (filters.subdistrict && filters.subdistrict !== 'all' && r.subdistrict !== filters.subdistrict) return false;
      return r.isHealthStation === 'Y';
    });
    // group โดยชื่อหน่วยบริการ (serviceUnit) — ใช้เป็น value ส่งให้ filter
    // เก็บชื่อหมู่บ้านที่สังกัด Health Station นี้ไว้แสดงใน label ด้วย
    const grouped: Record<string, { value: string; label: string; villages: Set<string> }> = {};
    base.forEach(r => {
      if (!grouped[r.serviceUnit]) {
        grouped[r.serviceUnit] = { value: r.serviceUnit, label: r.serviceUnit, villages: new Set() };
      }
      if (r.village) grouped[r.serviceUnit].villages.add(r.village);
    });
    const opts: { value: string; label: string }[] = Object.values(grouped).map(o => {
      const villages = [...o.villages];
      const villageLabel = villages.length === 1
        ? villages[0]
        : villages.join(', ');
      return {
        value: o.value,
        label: villageLabel ? `${o.value} (${villageLabel})` : o.value,
      };
    });
    return opts.sort((a, b) => a.label.localeCompare(b.label, 'th'));
  }, [records, filters.district, filters.subdistrict]);

  return (
    <div className="surface-card overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between border-b bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/70 px-4 py-3 dark:from-slate-900 dark:via-cyan-950/20 dark:to-emerald-950/20">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-300">
            <SlidersHorizontal className="h-4 w-4" />
          </span>
          <div>
            <span className="text-sm font-bold">ตัวกรองข้อมูล</span>
            <p className="text-[11px] text-muted-foreground">เลือกพื้นที่ หน่วยบริการ และ Health Station</p>
          </div>
          {hasActive && <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">มีตัวกรอง</span>}
        </div>
        <div className="flex items-center gap-2">
          {hasActive && (
            <Button variant="ghost" size="sm" onClick={clear} className="h-8 gap-1 rounded-md text-xs text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" /> ล้างทั้งหมด
            </Button>
          )}
          {compact && (
            <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="h-8 gap-1 rounded-md text-xs">
              {expanded ? 'ซ่อน' : 'แสดง'} <ChevronDown className={cn('h-3 w-3 transition-transform', expanded ? 'rotate-180' : '')} />
            </Button>
          )}
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <F label="อำเภอ" icon={MapPinned}>
            <Select value={filters.district || 'all'} onValueChange={v => set('district', v)}>
              <SelectTrigger className="h-10 rounded-lg bg-white/80 text-xs shadow-sm dark:bg-white/5"><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {districtOptions.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>

          <F label="ตำบล" icon={Map}>
            <Select value={filters.subdistrict || 'all'} onValueChange={v => set('subdistrict', v)} disabled={subdistrictOptions.length === 0}>
              <SelectTrigger className="h-10 rounded-lg bg-white/80 text-xs shadow-sm dark:bg-white/5"><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {subdistrictOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>

          <F label="หมู่บ้าน" icon={Home}>
            <Select value={filters.village || 'all'} onValueChange={v => set('village', v)} disabled={villageOptions.length === 0}>
              <SelectTrigger className="h-10 rounded-lg bg-white/80 text-xs shadow-sm dark:bg-white/5"><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {villageOptions.map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>

          <F label="หน่วยบริการ" icon={Hospital}>
            <Select value={filters.serviceUnit || 'all'} onValueChange={v => set('serviceUnit', v)} disabled={serviceUnitOptions.length === 0}>
              <SelectTrigger className="h-10 rounded-lg bg-white/80 text-xs shadow-sm dark:bg-white/5"><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                {serviceUnitOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>

          <F label="Health Station (Y=มี)" icon={BadgeCheck}>
            <Select value={filters.healthStation || 'all'} onValueChange={v => set('healthStation', v)}>
              <SelectTrigger className="h-10 rounded-lg bg-white/80 text-xs shadow-sm dark:bg-white/5"><SelectValue placeholder="ทั้งหมด" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">ทั้งหมด</SelectItem>
                <SelectItem value="Y">เป็น Healthstation</SelectItem>
                {healthStationOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </F>
        </div>
      )}
    </div>
  );
}

function F({ label, icon: Icon = Filter, children }: { label: string; icon?: typeof Filter; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </label>
      {children}
    </div>
  );
}
