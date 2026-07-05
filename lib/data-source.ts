/**
 * DATA SOURCE — ดึงข้อมูลจาก Google Sheet ผ่าน API Route /api/sheet
 * Sheet ID: 1-UxUwzKYf5Fucwz5QSlbsXDj2luSorKB3AD6BtytEiI
 */
import { AggregatedRecord } from '@/types/health-station';

export async function fetchSheetData(program: 'dm' | 'ht'): Promise<AggregatedRecord[]> {
  const res = await fetch(`/api/sheet?program=${program}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch ${program} data`);
  return res.json();
}
