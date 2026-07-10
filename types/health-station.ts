// Types ที่ตรงกับโครงสร้างข้อมูลจริงจาก Google Sheet

export type ProgramType = 'dm' | 'ht';

// แถวข้อมูลรวม (aggregated) ต่อ หมู่บ้าน × หน่วยบริการ
export interface AggregatedRecord {
  program: ProgramType;
  province: string;
  districtCode: string;
  district: string;
  subdistrictCode: string;
  subdistrict: string;
  serviceUnitCode: string;
  serviceUnit: string;
  villageCode: string;
  village: string;
  isHealthStation: 'Y' | '';
  normal: number;
  risk: number;
  suspected: number;
  darkGreen: number;
  yellow: number;
  orange: number;
  red: number;
  black: number;
  notScreened: number;
  total: number;
}

export interface AggregatedFilterState {
  district: string;
  subdistrict: string;
  serviceUnit: string;
  village: string;
  healthStation: string;
}

export interface AggregateSummary {
  total: number;
  normal: number;
  risk: number;
  suspected: number;
  darkGreen: number;
  yellow: number;
  orange: number;
  red: number;
  black: number;
  notScreened: number;
  stationCount: number;
  serviceUnitCount: number;
}

// ===== Population Data (Sheet Pop) =====

/** ช่วงอายุ 22 กลุ่ม เรียงตามลำดับ g1-g22 */
export const AGE_GROUPS: { id: number; label: string }[] = [
  { id: 1,  label: 'น้อยกว่า 1 ปี' },
  { id: 2,  label: '1-4 ปี' },
  { id: 3,  label: '5-9 ปี' },
  { id: 4,  label: '10-14 ปี' },
  { id: 5,  label: '15-19 ปี' },
  { id: 6,  label: '20-24 ปี' },
  { id: 7,  label: '25-29 ปี' },
  { id: 8,  label: '30-34 ปี' },
  { id: 9,  label: '35-39 ปี' },
  { id: 10, label: '40-44 ปี' },
  { id: 11, label: '45-49 ปี' },
  { id: 12, label: '50-54 ปี' },
  { id: 13, label: '55-59 ปี' },
  { id: 14, label: '60-64 ปี' },
  { id: 15, label: '65-69 ปี' },
  { id: 16, label: '70-74 ปี' },
  { id: 17, label: '75-79 ปี' },
  { id: 18, label: '80-84 ปี' },
  { id: 19, label: '85-89 ปี' },
  { id: 20, label: '90-94 ปี' },
  { id: 21, label: '95-99 ปี' },
  { id: 22, label: 'ตั้งแต่ 100 ปีขึ้นไป' },
];

export type Gender = 'male' | 'female' | 'all';

/** แถวข้อมูลประชากรต่อ หมู่บ้าน × หน่วยบริการ (จาก Sheet Pop) */
export interface PopulationRecord {
  province: string;
  districtCode: string;
  district: string;
  subdistrictCode: string;
  subdistrict: string;
  serviceUnitCode: string;
  serviceUnit: string;
  villageCode: string;
  village: string;
  isHealthStation: 'Y' | '';
  // ผู้ชาย g1-g22
  male_g1: number;   male_g2: number;   male_g3: number;   male_g4: number;
  male_g5: number;   male_g6: number;   male_g7: number;   male_g8: number;
  male_g9: number;   male_g10: number;  male_g11: number;  male_g12: number;
  male_g13: number;  male_g14: number;  male_g15: number;  male_g16: number;
  male_g17: number;  male_g18: number;  male_g19: number;  male_g20: number;
  male_g21: number;  male_g22: number;
  // ผู้หญิง g1-g22
  female_g1: number;   female_g2: number;   female_g3: number;   female_g4: number;
  female_g5: number;   female_g6: number;   female_g7: number;   female_g8: number;
  female_g9: number;   female_g10: number;  female_g11: number;  female_g12: number;
  female_g13: number;  female_g14: number;  female_g15: number;  female_g16: number;
  female_g17: number;  female_g18: number;  female_g19: number;  female_g20: number;
  female_g21: number;  female_g22: number;
}

export interface PopulationFilterState {
  district: string;
  subdistrict: string;
  serviceUnit: string;
  village: string;
  healthStation: string;
  gender: Gender;
  ageGroups: number[]; // เลือกหลายกลุ่มได้ เช่น [1, 2, 3]
}

export interface PopulationSummary {
  total: number;
  maleTotal: number;
  femaleTotal: number;
  byAgeGroup: { id: number; label: string; male: number; female: number; total: number }[];
}
