export function formatNumber(n: number): string {
  return n.toLocaleString('th-TH');
}
export function formatPercent(n: number, decimals = 1): string {
  return `${n.toFixed(decimals)}%`;
}

export const PING_PONG_COLORS = [
  { key: 'darkGreen', label: 'เขียวเข้ม', color: '#166534' },
  { key: 'yellow',    label: 'เหลือง',    color: '#CA8A04' },
  { key: 'orange',    label: 'ส้ม',       color: '#EA580C' },
  { key: 'red',       label: 'แดง',       color: '#DC2626' },
  { key: 'black',     label: 'ดำ',        color: '#1E293B' },
] as const;

export const SCREENING_STATUS_COLORS = {
  normal:    { label: 'ปกติ',       color: '#166534' },
  risk:      { label: 'เสี่ยง',     color: '#CA8A04' },
  suspected: { label: 'สงสัยป่วย', color: '#DC2626' },
};

export const DISTRICTS = [
  'เมืองสตูล','ควนโดน','ควนกาหลง','ท่าแพ','ละงู','ทุ่งหว้า','มะนัง',
];
