import { AggregatedRecord, ProgramType, PopulationRecord } from '@/types/health-station';

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

/**
 * Parse CSV จาก Sheet Pop → PopulationRecord[]
 * โครงสร้างคอลัมน์จริง (อัปเดตล่าสุด):
 * [0]รหัสอำเภอ [1]อำเภอ [2]รหัสตำบล [3]ตำบล [4]รหัสหมู่บ้าน [5]หมู่บ้าน
 * [6]รหัสหน่วยบริการ [7]หน่วยบริการ [8]healthstaion [9]id [10]hospcode [11]areacode [12]date_com [13]b_year
 * [14]male_g1 [15]female_g1 [16]male_g2 [17]female_g2 ... สลับชาย/หญิงจนถึง g22
 * male_gN = index 14 + (N-1)*2, female_gN = index 15 + (N-1)*2
 */
export function parsePopulationCSV(csv: string): PopulationRecord[] {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const records: PopulationRecord[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCSVLine(lines[i]);
    // ต้องมีอย่างน้อย 58 คอลัมน์ (0-57)
    if (cols.length < 58) continue;

    const n = (idx: number) => {
      const v = parseInt(cols[idx] ?? '0', 10);
      return isNaN(v) ? 0 : v;
    };

    const district = cols[1];
    if (district === 'อำเภอ') continue; // ข้าม header ซ้ำ

    const rec: PopulationRecord = {
      province: 'สตูล',
      districtCode: cols[0],
      district: cols[1],
      subdistrictCode: cols[2],
      subdistrict: cols[3],
      serviceUnitCode: cols[6], // รหัสหน่วยบริการ
      serviceUnit: cols[7].trim(), // ชื่อหน่วยบริการ
      villageCode: cols[4],
      village: cols[5].trim(),
      isHealthStation: cols[8] === 'Y' ? 'Y' : '',
      // male_g1-g22 (สลับกับ female) เริ่มที่ index 14
      male_g1: n(14),  female_g1: n(15),
      male_g2: n(16),  female_g2: n(17),
      male_g3: n(18),  female_g3: n(19),
      male_g4: n(20),  female_g4: n(21),
      male_g5: n(22),  female_g5: n(23),
      male_g6: n(24),  female_g6: n(25),
      male_g7: n(26),  female_g7: n(27),
      male_g8: n(28),  female_g8: n(29),
      male_g9: n(30),  female_g9: n(31),
      male_g10: n(32), female_g10: n(33),
      male_g11: n(34), female_g11: n(35),
      male_g12: n(36), female_g12: n(37),
      male_g13: n(38), female_g13: n(39),
      male_g14: n(40), female_g14: n(41),
      male_g15: n(42), female_g15: n(43),
      male_g16: n(44), female_g16: n(45),
      male_g17: n(46), female_g17: n(47),
      male_g18: n(48), female_g18: n(49),
      male_g19: n(50), female_g19: n(51),
      male_g20: n(52), female_g20: n(53),
      male_g21: n(54), female_g21: n(55),
      male_g22: n(56), female_g22: n(57),
    };
    records.push(rec);
  }
  return records;
}
