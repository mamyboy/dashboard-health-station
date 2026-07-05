#!/bin/bash

# Health Station - Clean Rebuild Script
# สคริปต์สำหรับลบ build เก่าและ build ใหม่

echo "🧹 กำลังลบโฟลเดอร์ .next เก่า..."
rm -rf .next

echo "🔨 กำลัง build โปรเจกต์ใหม่..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Clean rebuild สำเร็จ!"
    echo ""
    read -p "ต้องการเริ่ม dev server หรือไม่? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🛑 กำลังเคลียร์พอร์ต 3000..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        echo "🚀 กำลังเริ่ม dev server ที่พอร์ต 3000..."
        npm run dev
    fi
else
    echo "❌ Build ล้มเหลว กรุณาตรวจสอบ error"
    exit 1
fi
