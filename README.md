# Health Station Dashboard — Prototype

> Web App Dashboard ต้นแบบสำหรับระบบ Health Station จังหวัดสตูล
> พัฒนาด้วย Next.js 15 · React · TypeScript · Tailwind CSS · shadcn/ui

---

## คำอธิบาย

ระบบ Health Station Dashboard เป็น Frontend Prototype สำหรับติดตาม วิเคราะห์ และสรุปผลข้อมูลบริการสุขภาพจากจุดบริการ Health Station ในพื้นที่จังหวัดสตูล

**โหมดต้นแบบ (Prototype Mode):**
- ใช้ Mockup Data ทั้งหมด (500+ รายการจำลอง)
- ไม่เชื่อมต่อฐานข้อมูลจริง
- ไม่เชื่อม Google Sheet
- ไม่มี Backend จริง

---

## Technology Stack

| เทคโนโลยี | เวอร์ชัน | ใช้สำหรับ |
|---|---|---|
| Next.js App Router | 15.x | Framework หลัก |
| React | 19.x | UI Library |
| TypeScript | 5.x | Type Safety |
| Tailwind CSS | 3.x | Styling |
| shadcn/ui (custom) | - | UI Components |
| Lucide React | 0.468 | Icons |
| Recharts | 2.x | Charts & Graphs |
| TanStack Table | 8.x | Data Table |
| next-themes | 0.4 | Dark Mode |
| Radix UI | latest | Accessible Primitives |

---

## วิธีเริ่มต้นใช้งาน

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. เริ่ม Development Server

```bash
npm run dev
```

เปิดเบราว์เซอร์ที่ [http://localhost:3000](http://localhost:3000)

### 3. Build สำหรับ Production

```bash
npm run build
npm start
```

---

## โครงสร้างไฟล์

```
app/
├── layout.tsx                    # Root Layout + ThemeProvider
├── page.tsx                      # Redirect → /dashboard
└── dashboard/
    ├── page.tsx                  # 🏠 Overview Dashboard
    ├── analytics/page.tsx        # 📊 Service Analytics
    ├── risk/page.tsx             # 🛡️ Risk Screening
    ├── performance/page.tsx      # 📍 Area Performance
    ├── data-table/page.tsx       # 📋 Data Table
    └── admin/page.tsx            # ⚙️ Admin / Import

components/
├── layout/
│   ├── AppSidebar.tsx            # Sidebar Navigation
│   ├── TopNavbar.tsx             # Top Navigation Bar
│   ├── DashboardShell.tsx        # Page Shell Wrapper
│   └── ThemeProvider.tsx         # Dark Mode Provider
├── dashboard/
│   ├── KpiCard.tsx               # KPI Card + Bento Card
│   ├── RiskBadge.tsx             # Risk & Status Badges
│   └── LoadingSkeleton.tsx       # Loading States + Empty State
├── charts/
│   └── Charts.tsx                # All Chart Components
├── filters/
│   └── FilterBar.tsx             # Global Filter Bar
└── ui/
    ├── button.tsx                # Button Component
    ├── card.tsx                  # Card Components
    ├── badge.tsx                 # Badge Component
    ├── input.tsx                 # Input Component
    ├── select.tsx                # Select/Dropdown
    ├── progress.tsx              # Progress Bar
    ├── separator.tsx             # Separator
    ├── toast.tsx                 # Toast Notification
    ├── toaster.tsx               # Toast Container
    └── use-toast.ts              # Toast Hook

mock/
├── health-station-data.ts        # 500 Health Records
├── dashboard-summary.ts          # Dashboard KPIs & Charts
├── risk-data.ts                  # Risk Analysis Data
└── performance-data.ts           # Station Performance Data

types/
└── health-station.ts             # TypeScript Types

lib/
├── utils.ts                      # cn() utility
├── formatters.ts                 # Labels & Formatters
└── calculations.ts               # Filter & Calc Functions
```

---

## หน้าจอในระบบ

| หน้า | URL | คำอธิบาย |
|---|---|---|
| Overview Dashboard | `/dashboard` | KPI Cards, แนวโน้ม, กราฟเปรียบเทียบ |
| Service Analytics | `/dashboard/analytics` | วิเคราะห์บริการ, Ranking สถานี |
| Risk Screening | `/dashboard/risk` | วิเคราะห์ความเสี่ยง, รายการที่ต้องติดตาม |
| Area Performance | `/dashboard/performance` | ผลการดำเนินงานรายอำเภอ/สถานี |
| Data Table | `/dashboard/data-table` | ตารางข้อมูลพร้อม Filter, Sort, Pagination |
| Admin / Import | `/dashboard/admin` | จำลองการนำเข้าข้อมูล CSV |

---

## ฟีเจอร์หลัก

- ✅ **Responsive Design** — รองรับทุกขนาดหน้าจอ
- ✅ **Dark Mode** — สลับ Light/Dark ได้จาก TopBar
- ✅ **Global Filter** — กรองข้อมูลตามอำเภอ, ความเสี่ยง, เพศ, อายุ ฯลฯ
- ✅ **Real-time Filter** — KPI, Chart และ Table เปลี่ยนตาม Filter
- ✅ **Interactive Charts** — Area, Bar, Donut, Stacked Bar Charts
- ✅ **Data Table** — Sort, Search, Pagination, Column Visibility
- ✅ **Risk Badges** — แสดงสีตามระดับความเสี่ยง
- ✅ **Toast Notifications** — แจ้งเตือนผลการทำงาน
- ✅ **Loading States** — Skeleton Loading
- ✅ **Mock Interactions** — Refresh, Export, Import, Upload

---

## การต่อยอดเชื่อม Google Sheet / Database ในอนาคต

โครงสร้าง code พร้อมต่อยอด:

1. **แทน Mock Data ด้วย API Call:**
   ```ts
   // แทนที่
   import { HEALTH_RECORDS } from '@/mock/health-station-data'

   // ด้วย
   const records = await fetch('/api/health-records').then(r => r.json())
   ```

2. **เชื่อม Google Sheet API:**
   ```ts
   // สร้าง lib/google-sheets.ts
   // ใช้ googleapis package
   // Route: app/api/health-records/route.ts
   ```

3. **Type ทุกอย่างพร้อมแล้ว** ใน `types/health-station.ts`

4. **Filter Logic** ใน `lib/calculations.ts` ทำงานได้ทั้ง client-side และ server-side

---

## Mock Data Spec

ข้อมูลจำลอง 500 รายการ ครอบคลุม:

- **7 อำเภอ**: เมืองสตูล, ควนโดน, ควนกาหลง, ท่าแพ, ละงู, ทุ่งหว้า, มะนัง
- **18 Health Station**
- **ปีงบประมาณ 2568** (ต.ค. 2567 – ก.ย. 2568)
- Field ครบถ้วนตาม Spec ทุก field

---

## ผู้พัฒนา

พัฒนาเป็น Prototype สำหรับนำเสนอผู้บริหาร
สำนักงานสาธารณสุขจังหวัดสตูล — ปีงบประมาณ 2568
