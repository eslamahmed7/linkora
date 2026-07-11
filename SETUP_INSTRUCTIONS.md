# Linkora - Local Setup Instructions

## سريع البدء / Quick Start

### المتطلبات / Requirements
- Node.js 18+ 
- pnpm (أو npm/yarn)

### خطوات التثبيت / Installation Steps

1. **فك ضغط الملف / Extract the file**
```bash
tar -xzf linkora-complete.tar.gz
cd v0-project
```

2. **تثبيت المكتبات / Install dependencies**
```bash
pnpm install
```

أو إذا لم تكن قد ثبتت pnpm:
```bash
npm install -g pnpm
pnpm install
```

3. **تشغيل المشروع / Run the project**
```bash
pnpm dev
```

سيفتح تلقائياً:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

---

## هيكل المشروع / Project Structure

```
v0-project/
├── src/                    # React Frontend (Vite)
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── api/              # API client functions
│   ├── stores/           # Zustand stores
│   ├── i18n/             # Arabic/English translations
│   └── main.tsx          # Entry point
├── server/               # Express Backend
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utilities
│   └── index.ts          # Server entry point
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
└── tsconfig.json         # TypeScript configuration
```

---

## المميزات الرئيسية / Main Features

✓ تسجيل دخول وإنشاء حسابات (Authentication)
✓ إنشاء صفحات الروابط (Link Pages)
✓ توليد رموز QR (QR Code Generation)
✓ تحليلات الزيارات (Analytics)
✓ دعم NFC
✓ تعدد اللغات (Arabic/English)
✓ Dark/Light Mode
✓ واجهة تصميم حديثة

---

## الأوامر المتاحة / Available Commands

```bash
# تشغيل المشروع
pnpm dev          # Run development server

# البناء
pnpm build        # Build for production
pnpm build:server # Build backend

# المعاينة
pnpm preview      # Preview production build

# التفتيش
pnpm exec tsc --noEmit  # Check TypeScript errors
```

---

## ملاحظات مهمة / Important Notes

1. **Base URL للـ API**: يتوجه تلقائياً إلى `http://localhost:3001`
2. **المصادقة**: تستخدم JWT tokens المخزنة في localStorage
3. **الترجمة**: يمكن التبديل بين العربية والإنجليزية من الواجهة
4. **الوضع الليلي**: يتم حفظه في localStorage

---

## استكشاف الأخطاء / Troubleshooting

### الخادم لا يبدأ
```bash
# تأكد أن port 3001 غير مستخدم
# أو غير port في server/config/env.ts
```

### الـ Frontend لا يحميل
```bash
# قم بحذف المجلدات وأعد التثبيت
rm -rf node_modules .vite
pnpm install
pnpm dev
```

### مشاكل TypeScript
```bash
pnpm exec tsc --noEmit
```

---

## تطوير إضافي / Further Development

- أضف متغيرات البيئة في `.env` (انسخ من `.env.example` إن وجد)
- عدّل ألوان Theme في `src/styles/globals.css`
- أضف routes جديدة في `server/routes/`
- أنشئ components جديدة في `src/components/`

---

## الدعم / Support

لأي مشاكل، تحقق من:
- `AUDIT_REPORT.md` - تقرير المراجعة
- `COMPLETION_REPORT.md` - حالة الإكمال
- رسائل الخطأ في console (F12)

---

**مرحباً بك في Linkora!** 
Welcome to Linkora!
