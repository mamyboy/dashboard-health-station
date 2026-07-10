import { NextResponse } from 'next/server';
import { parseSheetCSV, parsePopulationCSV } from '@/lib/sheet-parser';

// บังคับให้ route นี้เป็น dynamic เสมอ — ไม่ถูก static optimize
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const SHEET_ID = '1-UxUwzKYf5Fucwz5QSlbsXDj2luSorKB3AD6BtytEiI';

function sheetUrl(sheet: string) {
  return `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${sheet}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const program = searchParams.get('program') as 'dm' | 'ht' | 'pop' | null;

  if (program !== 'dm' && program !== 'ht' && program !== 'pop') {
    return NextResponse.json({ error: 'program must be dm, ht or pop' }, { status: 400 });
  }

  try {
    // cache: 'no-store' = ดึงจาก Google Sheet สดทุก request ไม่มี cache
    const res = await fetch(sheetUrl(program), { cache: 'no-store' });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
    const csv = await res.text();
    const records = program === 'pop' ? parsePopulationCSV(csv) : parseSheetCSV(csv, program);
    return NextResponse.json(records, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    });
  } catch (err) {
    console.error('[API /api/sheet] error:', err);
    return NextResponse.json({ error: 'Failed to fetch sheet data' }, { status: 500 });
  }
}
