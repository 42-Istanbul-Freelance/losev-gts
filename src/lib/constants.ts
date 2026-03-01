// ─────────────────────────────────────────────
// ROLLER
// ─────────────────────────────────────────────
export const ROLES = {
  STUDENT: "STUDENT",
  TEACHER: "TEACHER",
  HQ: "HQ",
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: "Öğrenci",
  TEACHER: "Koordinatör Öğretmen",
  HQ: "Genel Merkez",
}

export const ROLE_ICONS: Record<Role, string> = {
  STUDENT: "🎓",
  TEACHER: "📚",
  HQ: "🏢",
}

// ─────────────────────────────────────────────
// FAALİYET TÜRLERİ
// ─────────────────────────────────────────────
export const ACTIVITY_TYPES = {
  SEMINAR: "Seminer",
  STAND: "Stant",
  DONATION: "Bağış Toplama",
  FAIR: "Kermes",
  SOCIAL_MEDIA: "Sosyal Medya",
  VISIT: "Ziyaret",
  EDUCATION: "Eğitim",
  OTHER: "Diğer",
} as const

export type ActivityType = keyof typeof ACTIVITY_TYPES

// ─────────────────────────────────────────────
// FAALİYET DURUMLARI
// ─────────────────────────────────────────────
export const ACTIVITY_STATUS = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const

export type ActivityStatus = (typeof ACTIVITY_STATUS)[keyof typeof ACTIVITY_STATUS]

export const STATUS_LABELS: Record<ActivityStatus, string> = {
  PENDING: "Bekliyor",
  APPROVED: "Onaylandı",
  REJECTED: "Reddedildi",
}

export const STATUS_COLORS: Record<ActivityStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
}

// ─────────────────────────────────────────────
// ROZET SEVİYELERİ
// ─────────────────────────────────────────────
export const BADGE_LEVELS = {
  NEW: { label: "Yeni İnci", color: "#e5e7eb", icon: "🫧", min: 0 },
  BRONZE: { label: "Bronz İnci", color: "#cd7f32", icon: "🥉", min: 25 },
  SILVER: { label: "Gümüş İnci", color: "#c0c0c0", icon: "🥈", min: 50 },
  GOLD: { label: "Altın İnci", color: "#ffd700", icon: "🥇", min: 100 },
} as const

export type BadgeLevel = keyof typeof BADGE_LEVELS

// ─────────────────────────────────────────────
// HEDEFLER
// ─────────────────────────────────────────────
export const YEARLY_TARGET_HOURS = 40
export const MAX_DAILY_HOURS = 8
export const CERTIFICATE_THRESHOLD = 40

// ─────────────────────────────────────────────
// SINIFLAR
// ─────────────────────────────────────────────
export const GRADES = ["9", "10", "11", "12"] as const

// ─────────────────────────────────────────────
// İLLER (81 il)
// ─────────────────────────────────────────────
export const CITIES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya",
  "Ankara", "Antalya", "Artvin", "Aydın", "Balıkesir",
  "Bilecik", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli",
  "Diyarbakır", "Edirne", "Elazığ", "Erzincan", "Erzurum",
  "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari",
  "Hatay", "Isparta", "Mersin", "İstanbul", "İzmir",
  "Kars", "Kastamonu", "Kayseri", "Kırklareli", "Kırşehir",
  "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
  "Kahramanmaraş", "Mardin", "Muğla", "Muş", "Nevşehir",
  "Niğde", "Ordu", "Rize", "Sakarya", "Samsun",
  "Siirt", "Sinop", "Sivas", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Şanlıurfa", "Uşak", "Van",
  "Yozgat", "Zonguldak", "Aksaray", "Bayburt", "Karaman",
  "Kırıkkale", "Batman", "Şırnak", "Bartın", "Ardahan",
  "Iğdır", "Yalova", "Karabük", "Kilis", "Osmaniye",
  "Düzce",
] as const
