import { AggregatedRecord, ProgramType } from '@/types/health-station';

/** Parse CSV string → AggregatedRecord[] */
export function parseSheetCSV(csv: string, program: ProgramType): AggregatedRecord[] {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const isDM = program === 'dm';
  const records: AggregatedRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    if (cols.length < 17) continue;

    const n = (idx: number) => {
      const v = parseInt(cols[idx] ?? '0', 10);
      return isNaN(v) ? 0 : v;
    };

    // DM: 18 cols (has "ดำ" at index 16), HT: 17 cols (no "ดำ")
    const normal      = n(9);
    const risk        = n(10);
    const suspected   = n(11);
    const darkGreen   = n(12);
    const yellow      = n(13);
    const orange      = n(14);
    const red         = n(15);
    const black       = isDM ? n(16) : 0;
    const notScreened = isDM ? n(17) : n(16);

    const districtCode = cols[0];
    const district     = cols[1];
    // Skip header row if re-appears
    if (district === 'อำเภอ') continue;

    records.push({
      program,
      province: 'สตูล',
      districtCode,
      district,
      subdistrictCode:  cols[2],
      subdistrict:      cols[3],
      serviceUnitCode:  cols[4],
      serviceUnit:      cols[5].trim(),
      villageCode:      cols[6],
      village:          cols[7].trim(),
      isHealthStation:  cols[8] === 'Y' ? 'Y' : '',
      normal,
      risk,
      suspected,
      darkGreen,
      yellow,
      orange,
      red,
      black,
      notScreened,
      total: normal + risk + suspected,
    });
  }
  return records;
}

/** RFC 4180 CSV parser — handles quoted fields with commas */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}
