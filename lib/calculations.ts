import { AggregatedRecord, AggregatedFilterState, AggregateSummary } from '@/types/health-station';

export function filterAggregated(
  records: AggregatedRecord[],
  filters: Partial<AggregatedFilterState>
): AggregatedRecord[] {
  return records.filter(r => {
    if (filters.district     && filters.district     !== 'all' && r.district     !== filters.district)     return false;
    if (filters.subdistrict  && filters.subdistrict  !== 'all' && r.subdistrict  !== filters.subdistrict)  return false;
    if (filters.serviceUnit  && filters.serviceUnit  !== 'all' && r.serviceUnit  !== filters.serviceUnit)  return false;
    if (filters.village      && filters.village      !== 'all' && r.village      !== filters.village)      return false;
    if (filters.healthStation && filters.healthStation !== 'all') {
      if (filters.healthStation === 'Y') {
        // Y = เป็น Healthstation ทั้งหมด
        if (r.isHealthStation !== 'Y') return false;
      } else {
        // ชื่อหน่วยบริการเฉพาะ = ต้องเป็น Y และชื่อตรง
        if (r.isHealthStation !== 'Y' || r.serviceUnit !== filters.healthStation) return false;
      }
    }
    return true;
  });
}

export function sumRecords(records: AggregatedRecord[]): AggregateSummary {
  const s: AggregateSummary = {
    total: 0, normal: 0, risk: 0, suspected: 0,
    darkGreen: 0, yellow: 0, orange: 0, red: 0, black: 0,
    notScreened: 0, stationCount: 0, serviceUnitCount: 0,
  };
  const stations = new Set<string>();
  const units    = new Set<string>();
  for (const r of records) {
    s.total       += r.total;
    s.normal      += r.normal;
    s.risk        += r.risk;
    s.suspected   += r.suspected;
    s.darkGreen   += r.darkGreen;
    s.yellow      += r.yellow;
    s.orange      += r.orange;
    s.red         += r.red;
    s.black       += r.black;
    s.notScreened += r.notScreened;
    if (r.isHealthStation === 'Y') stations.add(r.serviceUnitCode);
    units.add(r.serviceUnitCode);
  }
  s.stationCount     = stations.size;
  s.serviceUnitCount = units.size;
  return s;
}

export function groupByDistrict(records: AggregatedRecord[]) {
  const map: Record<string, { district: string; total: number; normal: number; risk: number; suspected: number; notScreened: number }> = {};
  for (const r of records) {
    if (!map[r.district]) map[r.district] = { district: r.district, total: 0, normal: 0, risk: 0, suspected: 0, notScreened: 0 };
    const d = map[r.district];
    d.total       += r.total;
    d.normal      += r.normal;
    d.risk        += r.risk;
    d.suspected   += r.suspected;
    d.notScreened += r.notScreened;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

export function groupBySubdistrict(records: AggregatedRecord[]) {
  const map: Record<string, { subdistrict: string; district: string; total: number; normal: number; risk: number; suspected: number; notScreened: number }> = {};
  for (const r of records) {
    const key = r.subdistrictCode;
    if (!map[key]) map[key] = { subdistrict: r.subdistrict, district: r.district, total: 0, normal: 0, risk: 0, suspected: 0, notScreened: 0 };
    const d = map[key];
    d.total       += r.total;
    d.normal      += r.normal;
    d.risk        += r.risk;
    d.suspected   += r.suspected;
    d.notScreened += r.notScreened;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}

export function groupByVillage(records: AggregatedRecord[]) {
  const map: Record<string, { village: string; subdistrict: string; district: string; total: number; normal: number; risk: number; suspected: number; notScreened: number }> = {};
  for (const r of records) {
    const key = r.villageCode || `${r.subdistrictCode}-${r.village}`;
    if (!map[key]) map[key] = { village: r.village, subdistrict: r.subdistrict, district: r.district, total: 0, normal: 0, risk: 0, suspected: 0, notScreened: 0 };
    const d = map[key];
    d.total       += r.total;
    d.normal      += r.normal;
    d.risk        += r.risk;
    d.suspected   += r.suspected;
    d.notScreened += r.notScreened;
  }
  return Object.values(map).sort((a, b) => b.total - a.total);
}
