# 🌟 LÖSEV Gönüllülük Takip Sistemi — Proje Planı

> **Teknoloji:** Next.js 14 (App Router) + Prisma ORM + SQLite  
> **Durum:** 📋 Planlama Aşaması  
> **Son Güncelleme:** 01 Mart 2026

---

## 📑 İçindekiler

1. [Proje Özeti](#1-proje-özeti)
2. [Teknoloji Kararları ve Best Practices](#2-teknoloji-kararları-ve-best-practices)
3. [Klasör Yapısı](#3-klasör-yapısı)
4. [Veritabanı Şeması (Prisma + SQLite)](#4-veritabanı-şeması-prisma--sqlite)
5. [Kimlik Doğrulama ve Yetkilendirme](#5-kimlik-doğrulama-ve-yetkilendirme)
6. [Sayfa ve Route Haritası](#6-sayfa-ve-route-haritası)
7. [API Endpoint Tasarımı](#7-api-endpoint-tasarımı)
8. [UI/UX Tasarım Sistemi](#8-uiux-tasarım-sistemi)
9. [Bileşen (Component) Haritası](#9-bileşen-component-haritası)
10. [Modül Detayları](#10-modül-detayları)
11. [Geliştirme Aşamaları (Sprint Plan)](#11-geliştirme-aşamaları-sprint-plan)
12. [Durum Takip Tablosu](#12-durum-takip-tablosu)

---

## 1. Proje Özeti

LÖSEV (Lösemili Çocuklar Sağlık ve Eğitim Vakfı) için geliştirilecek **Gönüllülük Takip Sistemi**, öğrencilerin yaptığı gönüllülük faaliyetlerini kayıt altına alan, öğretmenlerin bu faaliyetleri onayladığı ve genel merkezin tüm Türkiye genelinde analiz yapabildiği bir web uygulamasıdır.

### Hedefler

- Öğrencilerin yıllık 40 saatlik gönüllülük hedefini takip etmesi
- Koordinatör öğretmenlerin okul bazında faaliyet onayı yapabilmesi
- Genel merkezin il bazlı ve Türkiye geneli istatistiklere erişebilmesi
- 40 saati tamamlayan öğrencilere dijital sertifika üretimi

### Kullanıcı Rolleri

| Rol | Kod | Açıklama |
|-----|-----|----------|
| Öğrenci | `STUDENT` | Faaliyet girer, ilerlemesini takip eder |
| Öğretmen | `TEACHER` | Kendi okulundaki faaliyetleri onaylar/reddeder |
| Genel Merkez | `HQ` | Tüm verileri analiz eder, raporlar görür |

---

## 2. Teknoloji Kararları ve Best Practices

### 2.1 Temel Stack

| Katman | Teknoloji | Versiyon | Neden? |
|--------|-----------|----------|--------|
| Framework | Next.js | 14.x | App Router, Server Components, API Routes |
| ORM | Prisma | 5.x | Type-safe DB erişimi, migration yönetimi |
| Veritabanı | SQLite | 3.x | Dosya tabanlı, kurulum gerektirmez, prototiplemeye uygun |
| Auth | NextAuth.js | 5.x (v5 beta) | Credentials provider, session yönetimi |
| UI | Tailwind CSS | 3.x | Utility-first, hızlı geliştirme |
| Bileşenler | shadcn/ui | latest | Radix UI tabanlı, erişilebilir, özelleştirilebilir |
| Grafikler | Recharts | 2.x | React-native chart kütüphanesi |
| Form | React Hook Form + Zod | latest | Performanslı form yönetimi + şema validasyonu |
| Şifreleme | bcryptjs | latest | Şifre hashleme |

### 2.2 Best Practice Kuralları

#### Proje Geneli

- **App Router** kullanılacak (`/app` dizini), Pages Router kullanılmayacak
- **Server Components** varsayılan olacak; sadece interaktif bileşenler `"use client"` alacak
- **Server Actions** form işlemleri için tercih edilecek (API Route yerine mümkün olan yerlerde)
- **Environment Variables** `.env` dosyasında tutulacak, `.env.example` şablon olarak commit edilecek
- **TypeScript** zorunlu — `strict: true` modunda çalışılacak

#### Veritabanı / Prisma

- Her model değişikliğinde `npx prisma migrate dev` ile migration oluşturulacak
- Seed dosyası (`prisma/seed.ts`) ile demo veriler hazırlanacak
- Prisma Client singleton pattern kullanılacak (hot reload sorunlarını önlemek için)
- İlişkiler için `@relation` açıkça tanımlanacak
- SQLite kısıtlamaları göz önünde bulundurulacak (enum yerine String, DateTime formatı)

```typescript
// lib/prisma.ts — Singleton Pattern
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

#### Kimlik Doğrulama

- Şifreler **bcryptjs** ile hash'lenecek (salt rounds: 12)
- Session bilgisi **JWT** tabanlı olacak (SQLite ile DB session yerine)
- Her API/Server Action'da **rol kontrolü** yapılacak
- Middleware ile route koruması sağlanacak

#### Dosya Organizasyonu

- Her feature kendi klasöründe olacak (feature-based structure)
- Shared bileşenler `/components/ui` altında toplanacak
- Type tanımları `/types` klasöründe merkezi olarak tutulacak
- Validasyon şemaları `/lib/validations` altında tanımlanacak

#### Performans

- **Dynamic imports** büyük bileşenler için (chart kütüphaneleri vb.)
- **Image optimization** Next.js `<Image>` component ile
- **Loading states** her sayfa için `loading.tsx` dosyaları
- **Error boundaries** her layout segmentinde `error.tsx`

#### Güvenlik

- CSRF koruması NextAuth tarafından sağlanacak
- Input validasyonu hem client hem server tarafında (Zod)
- SQL Injection koruması Prisma ORM tarafından sağlanacak
- XSS koruması React'in varsayılan escape mekanizması ile

---

## 3. Klasör Yapısı

```
losev-gonulluluk/
├── app/
│   ├── (auth)/                          # Auth layout grubu
│   │   ├── layout.tsx                   # Ortalanmış, minimal layout
│   │   ├── login/
│   │   │   └── page.tsx                 # Giriş sayfası (rol seçimli)
│   │   └── register/
│   │       └── page.tsx                 # Kayıt sayfası (rol bazlı form)
│   │
│   ├── (dashboard)/                     # Dashboard layout grubu
│   │   ├── layout.tsx                   # Sidebar + Header layout
│   │   ├── student/                     # Öğrenci paneli
│   │   │   ├── page.tsx                 # Dashboard özet
│   │   │   ├── activities/
│   │   │   │   ├── page.tsx             # Faaliyet geçmişi
│   │   │   │   └── new/
│   │   │   │       └── page.tsx         # Yeni faaliyet girişi
│   │   │   └── certificate/
│   │   │       └── page.tsx             # Sertifika sayfası
│   │   │
│   │   ├── teacher/                     # Öğretmen paneli
│   │   │   ├── page.tsx                 # Dashboard özet
│   │   │   ├── approvals/
│   │   │   │   └── page.tsx             # Onay bekleyen faaliyetler
│   │   │   └── stats/
│   │   │       └── page.tsx             # Okul istatistikleri
│   │   │
│   │   └── hq/                          # Genel Merkez paneli
│   │       ├── page.tsx                 # Ana dashboard (grafikler)
│   │       ├── leaderboard/
│   │       │   └── page.tsx             # Liderlik tabloları
│   │       └── cities/
│   │           └── page.tsx             # İl bazlı analiz
│   │
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts             # NextAuth handler
│   │   └── upload/
│   │       └── route.ts                 # Dosya yükleme (simüle)
│   │
│   ├── layout.tsx                       # Root layout
│   ├── page.tsx                         # Landing / Redirect
│   ├── loading.tsx
│   ├── error.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                              # shadcn/ui bileşenleri
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   ├── table.tsx
│   │   ├── select.tsx
│   │   ├── progress.tsx
│   │   ├── sidebar.tsx
│   │   └── ...
│   │
│   ├── auth/
│   │   ├── role-selector.tsx            # Rol seçim kartları
│   │   ├── student-register-form.tsx
│   │   ├── teacher-register-form.tsx
│   │   └── login-form.tsx
│   │
│   ├── student/
│   │   ├── progress-bar.tsx             # 40 saat ilerleme çubuğu
│   │   ├── stats-cards.tsx              # Bu Ay / Bu Yıl / Toplam kartları
│   │   ├── pearl-badge.tsx              # İnci rozeti bileşeni
│   │   ├── activity-form.tsx            # Faaliyet giriş formu
│   │   └── activity-table.tsx           # Faaliyet geçmişi tablosu
│   │
│   ├── teacher/
│   │   ├── pending-activities.tsx       # Bekleyen faaliyetler listesi
│   │   ├── approval-card.tsx            # Onay/Red kartı
│   │   └── school-stats.tsx             # Okul istatistik kartları
│   │
│   ├── hq/
│   │   ├── overview-cards.tsx           # Genel sayaçlar
│   │   ├── donut-chart.tsx              # Faaliyet türü dağılımı
│   │   ├── bar-chart.tsx                # Aylık performans
│   │   ├── leaderboard-table.tsx        # Top 10 tabloları
│   │   └── city-stats-table.tsx         # İl bazlı tablo
│   │
│   ├── certificate/
│   │   └── certificate-modal.tsx        # Sertifika modal tasarımı
│   │
│   └── shared/
│       ├── header.tsx
│       ├── sidebar-nav.tsx
│       ├── mobile-nav.tsx
│       ├── theme-provider.tsx
│       └── losev-logo.tsx
│
├── lib/
│   ├── prisma.ts                        # Prisma singleton client
│   ├── auth.ts                          # NextAuth config
│   ├── auth-options.ts                  # Auth seçenekleri
│   ├── validations/
│   │   ├── auth.ts                      # Login/Register şemaları
│   │   ├── activity.ts                  # Faaliyet form şeması
│   │   └── approval.ts                  # Onay/Red şeması
│   ├── utils.ts                         # Yardımcı fonksiyonlar (cn, format vb.)
│   ├── constants.ts                     # Sabitler (roller, faaliyet türleri, iller)
│   └── helpers/
│       ├── badge.ts                     # Rozet hesaplama
│       ├── stats.ts                     # İstatistik hesaplama
│       └── certificate.ts              # Sertifika HTML üretimi
│
├── actions/                             # Server Actions
│   ├── auth.ts                          # Kayıt işlemleri
│   ├── activities.ts                    # Faaliyet CRUD
│   ├── approvals.ts                     # Onay/Red işlemleri
│   └── stats.ts                         # İstatistik sorguları
│
├── types/
│   ├── index.ts                         # Genel type tanımları
│   ├── auth.ts                          # Auth tipleri
│   └── activity.ts                      # Faaliyet tipleri
│
├── prisma/
│   ├── schema.prisma                    # Veritabanı şeması
│   ├── seed.ts                          # Demo veri
│   ├── migrations/                      # Migration dosyaları
│   └── dev.db                           # SQLite veritabanı dosyası
│
├── public/
│   ├── losev-logo.png
│   ├── losev-logo-white.png
│   ├── certificate-bg.png              # Sertifika arka plan görseli
│   └── uploads/                         # Simüle dosya yükleme dizini
│
├── .env                                 # Ortam değişkenleri
├── .env.example                         # Şablon
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 4. Veritabanı Şeması (Prisma + SQLite)

### 4.1 ER Diyagramı (Metin)

```
User (1) ──── (N) Activity
  │                    │
  │                    │ (onaylayan)
  │                    ▼
  │              ActivityReview
  │
  ├── role: STUDENT | TEACHER | HQ
  ├── school (ilişki)
  └── city / district

School (1) ──── (N) User
```

### 4.2 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// ─────────────────────────────────────────────
// KULLANICI
// ─────────────────────────────────────────────
model User {
  id                String   @id @default(cuid())
  email             String   @unique
  passwordHash      String
  role              String   // "STUDENT" | "TEACHER" | "HQ"
  fullName          String
  phone             String?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  // Öğrenci alanları
  tcNo              String?
  grade             String?           // Sınıf: "9", "10", "11", "12"
  coordinatorName   String?           // Koordinatör öğretmen adı (metin)

  // Ortak ilişkiler
  schoolId          String?
  school            School?  @relation(fields: [schoolId], references: [id])
  city              String?           // İl
  district          String?           // İlçe

  // İlişkiler
  activities        Activity[]        // Öğrencinin faaliyetleri
  reviews           ActivityReview[]  // Öğretmenin yaptığı incelemeler

  @@index([role])
  @@index([schoolId])
  @@index([city])
}

// ─────────────────────────────────────────────
// OKUL
// ─────────────────────────────────────────────
model School {
  id        String   @id @default(cuid())
  name      String   @unique
  city      String
  district  String
  createdAt DateTime @default(now())

  users     User[]

  @@index([city])
}

// ─────────────────────────────────────────────
// FAALİYET
// ─────────────────────────────────────────────
model Activity {
  id            String   @id @default(cuid())
  date          DateTime                    // Faaliyet tarihi
  type          String                      // "SEMINAR" | "STAND" | "DONATION" | "FAIR" | "SOCIAL_MEDIA" | "OTHER"
  hours         Float                       // Harcanan saat (max 8)
  description   String                      // Kısa açıklama
  attachmentUrl String?                     // Fotoğraf/belge URL (simüle)
  status        String   @default("PENDING") // "PENDING" | "APPROVED" | "REJECTED"
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // İlişkiler
  studentId     String
  student       User     @relation(fields: [studentId], references: [id], onDelete: Cascade)
  review        ActivityReview?

  @@index([studentId])
  @@index([status])
  @@index([date])
  @@index([type])
}

// ─────────────────────────────────────────────
// FAALİYET İNCELEME (Öğretmen Onayı)
// ─────────────────────────────────────────────
model ActivityReview {
  id          String   @id @default(cuid())
  decision    String                        // "APPROVED" | "REJECTED"
  note        String?                       // Geri bildirim notu (opsiyonel)
  reviewedAt  DateTime @default(now())

  // İlişkiler
  activityId  String   @unique
  activity    Activity @relation(fields: [activityId], references: [id], onDelete: Cascade)
  reviewerId  String
  reviewer    User     @relation(fields: [reviewerId], references: [id])

  @@index([reviewerId])
}
```

### 4.3 SQLite Notları

| Konu | SQLite Davranışı | Çözüm |
|------|-------------------|--------|
| Enum desteği yok | `enum` keyword'ü çalışmaz | `String` kullan + Zod ile validasyon |
| DateTime | ISO 8601 string olarak saklanır | Prisma otomatik handle eder |
| Foreign Key | Varsayılan kapalı | Prisma `PRAGMA foreign_keys = ON` yapar |
| Concurrent writes | Tek writer lock | Küçük ölçekli proje için sorun değil |
| JSON alanı | Kısıtlı destek | String olarak sakla, app seviyesinde parse et |

### 4.4 Seed Verileri

```
Seed planı:
├── 3 Okul (İstanbul, Ankara, İzmir)
├── 3 Öğretmen (her okula 1)
├── 9 Öğrenci (her okula 3)
├── 30+ Faaliyet (çeşitli türlerde ve durumlarda)
├── 1 Genel Merkez kullanıcısı
└── Test şifresi: tüm kullanıcılar için "Test1234!"
```

---

## 5. Kimlik Doğrulama ve Yetkilendirme

### 5.1 NextAuth.js v5 Yapılandırması

```
Auth Akışı:
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│  Login Form │────▶│  NextAuth    │────▶│  Prisma DB  │
│  (client)   │     │  Credentials │     │  User check │
└─────────────┘     └──────────────┘     └─────────────┘
                           │
                    ┌──────┴──────┐
                    │  JWT Token  │
                    │  (role,id)  │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │  Middleware  │
                    │  Route Guard│
                    └─────────────┘
```

### 5.2 JWT Token Payload

```typescript
interface SessionUser {
  id: string
  email: string
  fullName: string
  role: "STUDENT" | "TEACHER" | "HQ"
  schoolId?: string
  schoolName?: string
}
```

### 5.3 Middleware Route Koruması

```
Korunan Rotalar:
/student/*   → Sadece role === "STUDENT"
/teacher/*   → Sadece role === "TEACHER"
/hq/*        → Sadece role === "HQ"

Yönlendirme:
- Giriş yapmamış   → /login
- Yanlış rol        → /{doğru-panel}
- Giriş yapmış      → /{role}-dashboard
```

### 5.4 Erişim Kontrol Matrisi

| Özellik | Öğrenci | Öğretmen | Genel Merkez |
|---------|:-------:|:--------:|:------------:|
| Faaliyet girişi | ✅ | ❌ | ❌ |
| Kendi faaliyetlerini görme | ✅ | ❌ | ❌ |
| Sertifika indirme | ✅ | ❌ | ❌ |
| Faaliyet onaylama | ❌ | ✅ (kendi okulu) | ❌ |
| Okul istatistikleri | ❌ | ✅ (kendi okulu) | ✅ (tüm okullar) |
| Türkiye geneli analiz | ❌ | ❌ | ✅ |
| Liderlik tabloları | ❌ | ❌ | ✅ |
| İl bazlı rapor | ❌ | ❌ | ✅ |

---

## 6. Sayfa ve Route Haritası

### 6.1 Auth Sayfaları

| Route | Sayfa | Açıklama |
|-------|-------|----------|
| `/` | Landing | Logo + Rol seçim kartları → login'e yönlendir |
| `/login` | Giriş | E-posta + Şifre + Rol seçimi |
| `/register` | Kayıt | Rol bazlı dinamik form (tab veya step) |

### 6.2 Öğrenci Paneli

| Route | Sayfa | Bileşenler |
|-------|-------|------------|
| `/student` | Dashboard | ProgressBar, StatsCards, PearlBadge |
| `/student/activities` | Faaliyet Geçmişi | ActivityTable (filtreli, sayfalı) |
| `/student/activities/new` | Yeni Faaliyet | ActivityForm |
| `/student/certificate` | Sertifika | CertificateModal (koşullu aktif) |

### 6.3 Öğretmen Paneli

| Route | Sayfa | Bileşenler |
|-------|-------|------------|
| `/teacher` | Dashboard | SchoolStats, RecentApprovals |
| `/teacher/approvals` | Onay Bekleyenler | PendingActivities, ApprovalCard |
| `/teacher/stats` | Okul İstatistikleri | Charts, TopStudents |

### 6.4 Genel Merkez Paneli

| Route | Sayfa | Bileşenler |
|-------|-------|------------|
| `/hq` | Ana Dashboard | OverviewCards, DonutChart, BarChart |
| `/hq/leaderboard` | Liderlik | Top10Schools, Top10Students |
| `/hq/cities` | İl Bazlı Analiz | CityStatsTable |

---

## 7. API Endpoint Tasarımı

### 7.1 Yaklaşım: Server Actions Öncelikli

Çoğu veri işlemi **Server Actions** ile yapılacak. API Routes yalnızca dosya yükleme gibi özel durumlar için kullanılacak.

### 7.2 Server Actions

```
actions/
├── auth.ts
│   ├── registerStudent(formData)    → User
│   ├── registerTeacher(formData)    → User
│   └── (login NextAuth tarafından yönetilir)
│
├── activities.ts
│   ├── createActivity(formData)     → Activity
│   ├── getMyActivities(filters)     → Activity[]
│   ├── getActivityById(id)          → Activity + Review
│   └── getMonthlyHours(studentId)   → { month, year, total }
│
├── approvals.ts
│   ├── getPendingActivities()       → Activity[] (okul filtreli)
│   ├── approveActivity(id, note?)   → ActivityReview
│   └── rejectActivity(id, note?)    → ActivityReview
│
└── stats.ts
    ├── getStudentStats(studentId)   → { thisMonth, thisYear, total, badge }
    ├── getSchoolStats(schoolId)     → { totalHours, activeStudents, topStudents }
    ├── getHQOverview()              → { totalHours, totalStudents, byType, byMonth }
    ├── getTopSchools(limit)         → School[] (sıralı)
    ├── getTopStudents(limit)        → User[] (sıralı)
    └── getCityStats()               → { city, totalHours, studentCount }[]
```

### 7.3 API Routes

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/api/auth/[...nextauth]` | NextAuth handler |
| POST | `/api/upload` | Dosya yükleme (simüle — base64 kayıt) |

### 7.4 Veri Getirme Stratejisi

| Durum | Yöntem |
|-------|--------|
| Sayfa ilk yüklenme (SSR) | Server Component içinde doğrudan Prisma sorgusu |
| Form gönderme | Server Action |
| Client-side güncelleme | `useTransition` + Server Action + `router.refresh()` |
| Gerçek zamanlı olmayan liste | Server Component + searchParams ile filtreleme |

---

## 8. UI/UX Tasarım Sistemi

### 8.1 Renk Paleti

```
LÖSEV Kurumsal Renkler:

Birincil (Primary):
  - Turuncu:       #f39200  → Butonlar, vurgu alanları, aktif durumlar
  - Turuncu Koyu:  #d97f00  → Hover durumları
  - Turuncu Açık:  #fff3e0  → Arka plan vurgusu

Nötr (Neutral):
  - Antrasit:      #333333  → Ana metin
  - Gri Koyu:      #555555  → İkincil metin
  - Gri:           #999999  → Placeholder, devre dışı
  - Gri Açık:      #f5f5f5  → Sayfa arka planı
  - Beyaz:         #ffffff  → Kart arka planları

Durum (Status):
  - Başarılı:      #22c55e  → Onaylandı durumu
  - Uyarı:         #f39200  → Bekliyor durumu (turuncu ile uyumlu)
  - Hata:          #ef4444  → Reddedildi durumu
  - Bilgi:         #3b82f6  → Bilgilendirme

Rozet Renkleri:
  - Yeni İnci:     #e5e7eb  (gri)
  - Bronz:         #cd7f32
  - Gümüş:         #c0c0c0
  - Altın:         #ffd700
```

### 8.2 Tailwind Config Uzantıları

```typescript
// tailwind.config.ts içinde:
theme: {
  extend: {
    colors: {
      losev: {
        orange: '#f39200',
        'orange-dark': '#d97f00',
        'orange-light': '#fff3e0',
        anthracite: '#333333',
      }
    }
  }
}
```

### 8.3 Tipografi

| Kullanım | Font | Boyut | Ağırlık |
|----------|------|-------|---------|
| Başlık (H1) | Inter | 2rem (32px) | 700 (Bold) |
| Başlık (H2) | Inter | 1.5rem (24px) | 600 (Semibold) |
| Başlık (H3) | Inter | 1.25rem (20px) | 600 |
| Gövde metin | Inter | 1rem (16px) | 400 (Regular) |
| Küçük metin | Inter | 0.875rem (14px) | 400 |
| Etiket/Badge | Inter | 0.75rem (12px) | 500 (Medium) |

### 8.4 Responsive Breakpoints

| Breakpoint | Piksel | Kullanım |
|------------|--------|----------|
| `sm` | 640px | Mobil yatay |
| `md` | 768px | Tablet |
| `lg` | 1024px | Masaüstü (Sidebar açılır) |
| `xl` | 1280px | Geniş ekran |

### 8.5 Layout Yapısı

```
┌──────────────────────────────────────────────────┐
│  Header (sticky)                    [User Menu ▼]│
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  Sidebar   │         Main Content                │
│  (collaps  │                                     │
│   ible on  │   ┌─────────┐ ┌─────────┐          │
│   mobile)  │   │  Card   │ │  Card   │          │
│            │   └─────────┘ └─────────┘          │
│  • Menü 1  │                                     │
│  • Menü 2  │   ┌───────────────────────┐         │
│  • Menü 3  │   │     Tablo / Chart     │         │
│            │   └───────────────────────┘         │
│            │                                     │
└────────────┴─────────────────────────────────────┘

Mobil: Sidebar gizli, hamburger menü ile açılır (Sheet)
```

---

## 9. Bileşen (Component) Haritası

### 9.1 Auth Bileşenleri

| Bileşen | Tür | Props | Açıklama |
|---------|-----|-------|----------|
| `RoleSelector` | Client | `onSelect(role)` | 3 kartlık rol seçimi (animasyonlu) |
| `LoginForm` | Client | — | E-posta + Şifre + Rol seçimi |
| `StudentRegisterForm` | Client | — | Öğrenci kayıt formu (8+ alan) |
| `TeacherRegisterForm` | Client | — | Öğretmen kayıt formu (4 alan) |

### 9.2 Öğrenci Bileşenleri

| Bileşen | Tür | Props | Açıklama |
|---------|-----|-------|----------|
| `ProgressBar` | Server | `currentHours, targetHours` | 40 saat doluluk çubuğu |
| `StatsCards` | Server | `thisMonth, thisYear, total` | 3'lü sayaç kartları |
| `PearlBadge` | Server | `totalHours` | Dinamik rozet (4 seviye) |
| `ActivityForm` | Client | `onSubmit` | Faaliyet giriş formu + dosya yükleme |
| `ActivityTable` | Client | `activities[]` | Sayfalı, filtrelenebilir tablo |
| `StatusBadge` | Server | `status` | Renkli durum etiketi |

### 9.3 Öğretmen Bileşenleri

| Bileşen | Tür | Props | Açıklama |
|---------|-----|-------|----------|
| `PendingActivities` | Client | `activities[]` | Onay bekleyen liste |
| `ApprovalCard` | Client | `activity, onApprove, onReject` | Detay + aksiyon kartı |
| `SchoolStats` | Server | `stats` | Okul istatistik kartları |
| `FeedbackInput` | Client | `onSubmit` | Geri bildirim notu textarea |

### 9.4 Genel Merkez Bileşenleri

| Bileşen | Tür | Props | Açıklama |
|---------|-----|-------|----------|
| `OverviewCards` | Server | `totalHours, totalStudents, ...` | Büyük sayaç kartları |
| `DonutChart` | Client | `data[]` | Faaliyet türü dağılımı |
| `MonthlyBarChart` | Client | `data[]` | Aylara göre performans |
| `LeaderboardTable` | Server | `items[], type` | Top 10 tablosu |
| `CityStatsTable` | Server | `cityStats[]` | İl bazlı saat tablosu |

### 9.5 Ortak Bileşenler

| Bileşen | Tür | Props | Açıklama |
|---------|-----|-------|----------|
| `SidebarNav` | Client | `role, items[]` | Rol bazlı sidebar menü |
| `Header` | Server | `user` | Üst çubuk + kullanıcı menüsü |
| `MobileNav` | Client | `role, items[]` | Mobil hamburger menü |
| `CertificateModal` | Client | `student, totalHours` | Sertifika önizleme + yazdır |
| `LosevLogo` | Server | `variant` | Logo bileşeni (beyaz/renkli) |

---

## 10. Modül Detayları

### 10.1 Giriş Ekranı ve Kayıt

#### Giriş Sayfası (`/login`)

```
Akış:
1. Kullanıcı rol seçer (3 kart: Öğrenci 🎓, Öğretmen 📚, Genel Merkez 🏢)
2. Seçime göre giriş formu gösterilir
3. E-posta + Şifre ile giriş
4. NextAuth session oluşturulur
5. Middleware role göre yönlendirir
```

#### Kayıt Sayfası (`/register`)

**Öğrenci Formu Alanları:**

| Alan | Tür | Zorunlu | Validasyon |
|------|-----|---------|------------|
| Ad Soyad | text | ✅ | min: 3, max: 100 |
| T.C. No | text | ❌ | 11 haneli sayı (opsiyonel) |
| E-posta | email | ✅ | geçerli e-posta formatı |
| Şifre | password | ✅ | min: 8, 1 büyük harf, 1 rakam |
| Şifre Tekrar | password | ✅ | şifre ile eşleşmeli |
| GSM | tel | ❌ | 05XX XXX XX XX formatı |
| Okul Adı | select/text | ✅ | mevcut okullardan seç veya yeni gir |
| İl | select | ✅ | 81 il listesi |
| İlçe | select | ✅ | seçilen ile göre dinamik |
| Sınıf | select | ✅ | 9, 10, 11, 12 |
| Koordinatör Öğretmen Adı | text | ❌ | serbest metin |

**Öğretmen Formu Alanları:**

| Alan | Tür | Zorunlu | Validasyon |
|------|-----|---------|------------|
| Ad Soyad | text | ✅ | min: 3, max: 100 |
| E-posta | email | ✅ | geçerli e-posta formatı |
| Şifre | password | ✅ | min: 8, 1 büyük harf, 1 rakam |
| Bağlı Olduğu Okul | select | ✅ | mevcut okullardan seç |

### 10.2 Öğrenci Paneli

#### Dashboard Özet

```
┌─────────────────────────────────────────────────┐
│  Hoş Geldin, {Ad Soyad}!              🏅 Bronz  │
├─────────────────────────────────────────────────┤
│                                                  │
│  ██████████████████░░░░░░░░  62.5%  (25/40 saat)│
│  ▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔▔ │
│                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Bu Ay    │  │ Bu Yıl   │  │ Toplam   │       │
│  │  8 saat  │  │ 25 saat  │  │ 25 saat  │       │
│  └──────────┘  └──────────┘  └──────────┘       │
│                                                  │
│  [+ Yeni Faaliyet Ekle]    [Geçmişi Gör →]      │
└─────────────────────────────────────────────────┘
```

#### İnci Rozeti Hesaplama

| Toplam Saat | Rozet | Renk | İkon |
|-------------|-------|------|------|
| 0 – 24.99 | Yeni İnci | Gri (#e5e7eb) | 🫧 |
| 25 – 49.99 | Bronz İnci | Bronz (#cd7f32) | 🥉 |
| 50 – 99.99 | Gümüş İnci | Gümüş (#c0c0c0) | 🥈 |
| 100+ | Altın İnci | Altın (#ffd700) | 🥇 |

```typescript
// lib/helpers/badge.ts
type BadgeLevel = "NEW" | "BRONZE" | "SILVER" | "GOLD"

function getBadgeLevel(totalHours: number): BadgeLevel {
  if (totalHours >= 100) return "GOLD"
  if (totalHours >= 50) return "SILVER"
  if (totalHours >= 25) return "BRONZE"
  return "NEW"
}
```

#### Faaliyet Giriş Formu

| Alan | Tür | Validasyon |
|------|-----|------------|
| Tarih | date picker | Bugün veya geçmiş (gelecek tarih yasak) |
| Faaliyet Türü | select | Enum listesinden |
| Harcanan Saat | number | min: 0.5, max: 8, step: 0.5 |
| Açıklama | textarea | min: 10, max: 500 karakter |
| Fotoğraf/Belge | file input | Opsiyonel, max 5MB, jpg/png/pdf |

**Faaliyet Türleri:**

```typescript
const ACTIVITY_TYPES = {
  SEMINAR: "Seminer",
  STAND: "Stant",
  DONATION: "Bağış Toplama",
  FAIR: "Kermes",
  SOCIAL_MEDIA: "Sosyal Medya",
  VISIT: "Ziyaret",
  EDUCATION: "Eğitim",
  OTHER: "Diğer",
} as const
```

#### Faaliyet Geçmişi Tablosu

| Sütun | Açıklama |
|-------|----------|
| Tarih | Faaliyet tarihi |
| Tür | Faaliyet türü etiketi |
| Saat | Harcanan saat |
| Açıklama | Kısaltılmış metin (hover ile tam metin) |
| Durum | Renkli badge: 🟡 Bekliyor / 🟢 Onaylandı / 🔴 Reddedildi |
| Öğretmen Notu | Varsa geri bildirim metni |

### 10.3 Koordinatör Öğretmen Paneli

#### Akıllı Filtreleme Mantığı

```
Sorgu Akışı:
1. Oturumdaki öğretmenin schoolId değeri alınır
2. Activity tablosu JOIN User → User.schoolId === öğretmen.schoolId
3. Sadece eşleşen kayıtlar listelenir
4. Ek filtreler: durum (Bekliyor/Tümü), tarih aralığı
```

#### Onay Kartı Tasarımı

```
┌─────────────────────────────────────────────┐
│  📋 Faaliyet Detayı                         │
├─────────────────────────────────────────────┤
│  Öğrenci:  Elif Yılmaz (10-A)              │
│  Tarih:    15 Şubat 2026                    │
│  Tür:      Kermes                           │
│  Saat:     4 saat                           │
│  Açıklama: Okul bahçesinde LÖSEV yararına   │
│            kermes düzenlendi...              │
│  Kanıt:    📎 foto.jpg (görüntüle)         │
├─────────────────────────────────────────────┤
│  Geri Bildirim (opsiyonel):                 │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
│                                             │
│       [❌ Reddet]          [✅ Onayla]      │
└─────────────────────────────────────────────┘
```

#### Okul İstatistikleri

| Metrik | Açıklama |
|--------|----------|
| Toplam Onaylı Saat | Okulun toplam gönüllülük saati |
| Aktif Öğrenci | En az 1 onaylı faaliyeti olan öğrenci sayısı |
| Bu Ayki Saat | Mevcut ay toplam saat |
| En Aktif 5 Öğrenci | Saat bazlı sıralama |

### 10.4 Genel Merkez Paneli

#### Ana Dashboard

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Toplam   │ │  Aktif   │ │  Toplam  │ │ Onay     │
│ Saat     │ │ Öğrenci  │ │  Okul    │ │ Bekleyen │
│ 12,450   │ │   847    │ │   52     │ │   23     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘

┌─────────────────────┐  ┌─────────────────────┐
│   🍩 Donut Chart    │  │   📊 Bar Chart      │
│   Faaliyet Türü     │  │   Aylık Performans  │
│   Dağılımı          │  │   (Oca-Ara)         │
└─────────────────────┘  └─────────────────────┘
```

#### Donut Chart Veri Yapısı

```typescript
interface ChartData {
  name: string   // "Seminer", "Stant", vb.
  value: number  // Toplam saat
  color: string  // Renk kodu
}
```

#### Liderlik Tabloları

**En Aktif 10 Okul:**

| # | Okul Adı | İl | Toplam Saat | Öğrenci Sayısı |
|---|----------|----|-------------|----------------|

**En Aktif 10 Öğrenci:**

| # | Ad Soyad | Okul | İl | Toplam Saat | Rozet |
|---|----------|------|----|-------------|-------|

#### İl Bazlı Etki Tablosu

| İl | Toplam Saat | Öğrenci Sayısı | Okul Sayısı | Ortalama Saat/Öğrenci |
|----|-------------|----------------|-------------|----------------------|

### 10.5 Dijital Sertifika

#### Koşul

```typescript
const canGenerateCertificate = (approvedHours: number) => approvedHours >= 40
```

#### Sertifika Modal Tasarımı

```
┌─────────────────────────────────────────────────────┐
│                                                      │
│              [LÖSEV LOGO]                            │
│                                                      │
│           GÖNÜLLÜLÜK BELGESİ                        │
│                                                      │
│    Bu belge,                                         │
│                                                      │
│         {Öğrenci Ad Soyad}                           │
│                                                      │
│    adlı öğrencinin {Okul Adı} bünyesinde            │
│    toplam {XX} saat gönüllülük faaliyeti             │
│    gerçekleştirdiğini belgeler.                      │
│                                                      │
│    İl: {İl}                                          │
│    Düzenlenme Tarihi: {Tarih}                        │
│                                                      │
│              ─────────────────                        │
│              LÖSEV Genel Merkez                       │
│                                                      │
│    [🖨️ Yazdır]              [⬇️ PDF İndir]          │
└─────────────────────────────────────────────────────┘
```

#### Teknik Uygulama

```
Sertifika üretimi:
1. HTML/CSS ile sertifika şablonu oluştur (print-optimized)
2. window.print() ile tarayıcı yazdırma dialogu aç
3. Alternatif: html2canvas + jsPDF ile client-side PDF üretimi
4. Sertifika verisi server'dan gelir, render client'ta yapılır
```

---

## 11. Geliştirme Aşamaları (Sprint Plan)

### Sprint 0: Proje Kurulumu (Tahmini: 2-3 saat)

- [ ] Next.js 14 projesi oluştur (`create-next-app`)
- [ ] TypeScript strict mode etkinleştir
- [ ] Tailwind CSS yapılandır + LÖSEV renk paleti ekle
- [ ] shadcn/ui kur ve temel bileşenleri ekle
- [ ] Prisma kur + SQLite bağlantısı
- [ ] `schema.prisma` dosyasını yaz
- [ ] İlk migration'ı çalıştır
- [ ] Seed dosyasını hazırla ve çalıştır
- [ ] Klasör yapısını oluştur
- [ ] `.env.example` şablonu yaz
- [ ] Prisma singleton client oluştur

### Sprint 1: Auth Sistemi (Tahmini: 4-5 saat)

- [ ] NextAuth.js v5 kur ve yapılandır
- [ ] Credentials provider (email + şifre + rol)
- [ ] JWT callback'te rol ve schoolId ekle
- [ ] Middleware route koruması yaz
- [ ] Login sayfası — Rol seçim kartları
- [ ] Login formu — Zod validasyonlu
- [ ] Öğrenci kayıt formu (tüm alanlar)
- [ ] Öğretmen kayıt formu
- [ ] registerStudent / registerTeacher server actions
- [ ] Başarılı giriş → rol bazlı yönlendirme

### Sprint 2: Öğrenci Paneli (Tahmini: 5-6 saat)

- [ ] Dashboard layout (Sidebar + Header)
- [ ] Responsive sidebar (mobilde hamburger)
- [ ] İlerleme çubuğu bileşeni (40 saat hedef)
- [ ] İstatistik kartları (Bu Ay / Bu Yıl / Toplam)
- [ ] İnci rozeti bileşeni (4 seviye)
- [ ] Faaliyet giriş formu (tüm validasyonlar)
- [ ] Dosya yükleme (simüle)
- [ ] createActivity server action
- [ ] Faaliyet geçmişi tablosu
- [ ] Durum badge'leri (Bekliyor/Onaylandı/Reddedildi)
- [ ] Tablo sayfalama (pagination)

### Sprint 3: Öğretmen Paneli (Tahmini: 4-5 saat)

- [ ] Öğretmen sidebar navigasyonu
- [ ] Bekleyen faaliyetler listesi (okul filtreli)
- [ ] Faaliyet detay kartı (açıklama + kanıt)
- [ ] Onayla/Reddet butonları
- [ ] Geri bildirim notu alanı
- [ ] approveActivity / rejectActivity server actions
- [ ] Okul istatistik kartları
- [ ] En aktif öğrenci listesi

### Sprint 4: Genel Merkez Paneli (Tahmini: 5-6 saat)

- [ ] HQ sidebar navigasyonu
- [ ] Genel sayaç kartları (toplam saat, öğrenci, okul)
- [ ] Donut chart — Faaliyet türü dağılımı (Recharts)
- [ ] Bar chart — Aylık performans (Recharts)
- [ ] Top 10 okul liderlik tablosu
- [ ] Top 10 öğrenci liderlik tablosu
- [ ] İl bazlı etki tablosu
- [ ] getHQOverview / getTopSchools / getCityStats server actions

### Sprint 5: Sertifika ve Polishing (Tahmini: 3-4 saat)

- [ ] Sertifika koşul kontrolü (≥40 saat)
- [ ] Sertifika modal tasarımı (LÖSEV logosu)
- [ ] Yazdır fonksiyonu (window.print)
- [ ] PDF indirme (html2canvas + jsPDF)
- [ ] Loading state'ler (tüm sayfalar)
- [ ] Error boundary'ler
- [ ] Boş durum (empty state) tasarımları
- [ ] Son responsive kontrolleri
- [ ] Genel test ve hata düzeltme

---

## 12. Durum Takip Tablosu

| # | Modül | Durum | Başlangıç | Bitiş | Notlar |
|---|-------|-------|-----------|-------|--------|
| 0 | Proje Kurulumu | ⬜ Planlandı | - | - | - |
| 1 | Auth Sistemi | ⬜ Planlandı | - | - | - |
| 2 | Öğrenci Paneli | ⬜ Planlandı | - | - | - |
| 3 | Öğretmen Paneli | ⬜ Planlandı | - | - | - |
| 4 | Genel Merkez | ⬜ Planlandı | - | - | - |
| 5 | Sertifika & Polish | ⬜ Planlandı | - | - | - |

**Durum Sembolleri:**
- ⬜ Planlandı
- 🔄 Devam Ediyor
- ✅ Tamamlandı
- ⚠️ Sorun Var
- ❌ İptal Edildi

---

## Ortam Değişkenleri (.env.example)

```env
# Veritabanı
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-min-32-chars"

# Uygulama
NEXT_PUBLIC_APP_NAME="LÖSEV Gönüllülük Takip Sistemi"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## Kurulum Komutları (Referans)

```bash
# 1. Proje oluştur
npx create-next-app@latest losev-gonulluluk --typescript --tailwind --eslint --app --src-dir=false

# 2. Bağımlılıkları kur
npm install prisma @prisma/client
npm install next-auth@beta
npm install bcryptjs
npm install react-hook-form @hookform/resolvers zod
npm install recharts
npm install html2canvas jspdf
npm install -D @types/bcryptjs

# 3. shadcn/ui kur
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select textarea badge dialog table progress tabs avatar dropdown-menu sheet separator

# 4. Prisma başlat
npx prisma init --datasource-provider sqlite
npx prisma migrate dev --name init
npx prisma db seed
```

---

> **📌 Not:** Bu doküman, geliştirme sürecinde her sprint tamamlandığında güncellenecektir. Her aşamada "Durum Takip Tablosu" güncellenerek ilerleme izlenebilir hale getirilecektir.
