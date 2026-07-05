#!/bin/bash

# Health Station - Build and Restart Script
# สคริปต์สำหรับ build และ restart โปรเจกต์

echo "🛑 กำลังหยุด dev server (ถ้ามี)..."
pkill -f "next dev" 2>/dev/null || true
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
sleep 1

echo "🔨 กำลัง build โปรเจกต์..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build สำเร็จ!"
    echo ""
    echo "🚀 กำลังเริ่ม dev server ที่พอร์ต 3000..."
    npm run dev
else
    echo "❌ Build ล้มเหลว กรุณาตรวจสอบ error"
    exit 1
fi
