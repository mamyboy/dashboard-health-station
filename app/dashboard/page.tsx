// Server Component — ดึงข้อมูลจาก Google Sheet โดยตรงตอน render
// ข้อมูลพร้อมทันทีไม่ต้องรอ useEffect

import { DashboardShell } from '@/components/layout/DashboardShell';
import { DashboardClient } from './DashboardClient';
import { parseSheetCSV } from '@/lib/sheet-parser';
import { AggregatedRecord } from '@/types/health-station';

export const dynamic = 'force-dynamic'; // ดึงสดทุก request
export const revalidate = 0;

const SHEET_ID = '1-UxUwzKYf5Fucwz5QSlbsXDj2luSorKB3AD6BtytEiI';

async function fetchSheet(program: 'dm' | 'ht'): Promise<AggregatedRecord[]> {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${program}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const csv = await res.text();
    return parseSheetCSV(csv, program);
  } catch {
    return [];
  }
}

export default async function DashboardPage() {
  const [dmData, htData] = await Promise.all([
    fetchSheet('dm'),
    fetchSheet('ht'),
  ]);

  return (
    <DashboardShell
      title="Health Station Dashboard"
      subtitle={`จังหวัดสตูล • DM: ${dmData.length} แถว | HT: ${htData.length} แถว`}
    >
      <DashboardClient initialDmData={dmData} initialHtData={htData} />
    </DashboardShell>
  );
}
