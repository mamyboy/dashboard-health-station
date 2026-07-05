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
