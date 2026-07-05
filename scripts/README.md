# Health Station - Build & Restart Scripts

สคริปต์สำหรับจัดการ build และ restart โปรเจกต์ Health Station

## สคริปต์ที่มีให้ใช้งาน

### 1. สคริปต์ NPM (ใช้ใน package.json)

```bash
# Build โปรเจกต์
npm run build

# เริ่ม dev server
npm run dev

# Build และ start production
npm run build:restart

# ลบ .next และ rebuild ใหม่
npm run rebuild
```

### 2. สคริปต์ Shell (ใช้ในโฟลเดอร์ scripts/)

#### Build และ Restart Dev Server
```bash
./scripts/build-and-restart.sh
```
- หยุด dev server ที่กำลังทำงาน
- Build โปรเจกต์ใหม่
- เริ่ม dev server อัตโนมัติ

#### Clean Rebuild
```bash
./scripts/clean-rebuild.sh
```
- ลบโฟลเดอร์ .next เก่า
- Build โปรเจกต์ใหม่
- ถามว่าต้องการเริ่ม dev server หรือไม่

## การใช้งาน

### แบบง่าย (แนะนำ)
```bash
npm run dev          # เริ่ม development
npm run build        # Build สำหรับ production
```

### แบบละเอียด
```bash
# Kill server เก่า, build และ restart
./scripts/build-and-restart.sh

# ทำความสะอาดและ rebuild ทั้งหมด
./scripts/clean-rebuild.sh
```

## การอัปเดต Icon และ UI

การ์ด KPI ใช้ icon ดังนี้:

- **คัดกรองแล้วทั้งหมด**: UserCheck (แทน ClipboardCheck)
- **ยังไม่ได้คัดกรอง**: Clock
- **หน่วยบริการ**: Building2
- **Health Station**: MapPinned
- **ปกติ**: Shield (แทน CheckCircle2)
- **เสี่ยง**: AlertTriangle
- **สงสัยป่วย**: Activity (แทน Microscope)
- **กลุ่มป่วย**: Stethoscope
- **อัตราเสี่ยงรวม**: TrendingDown (แทน Percent)

ทุกการ์ดมีการใช้ gradient พื้นหลังและ icon ที่สอดคล้องกัน

## หมายเหตุ

- สคริปต์ทั้งหมดถูกตั้งค่า execute permission แล้ว
- ถ้าพอร์ต 3000 ถูกใช้งาน Next.js จะเปลี่ยนไปใช้พอร์ต 3001 อัตโนมัติ
- การ rebuild แบบ clean จะช่วยแก้ปัญหา cache ที่อาจเกิดขึ้น
