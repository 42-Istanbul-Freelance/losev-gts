// prisma/seed.ts
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dbPath = path.resolve(__dirname, "..", "dev.db")
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("🌱 Seed başlatılıyor...")

  // Okulları oluştur
  const school1 = await prisma.school.upsert({
    where: { name: "Atatürk Anadolu Lisesi" },
    update: {},
    create: { name: "Atatürk Anadolu Lisesi", city: "İstanbul", district: "Kadıköy" },
  })
  const school2 = await prisma.school.upsert({
    where: { name: "Ankara Fen Lisesi" },
    update: {},
    create: { name: "Ankara Fen Lisesi", city: "Ankara", district: "Çankaya" },
  })
  const school3 = await prisma.school.upsert({
    where: { name: "İzmir Bornova Anadolu Lisesi" },
    update: {},
    create: { name: "İzmir Bornova Anadolu Lisesi", city: "İzmir", district: "Bornova" },
  })
  console.log("✅ Okullar oluşturuldu")

  const passwordHash = await bcrypt.hash("Test1234!", 12)

  await prisma.user.upsert({
    where: { email: "hq@losev.org.tr" },
    update: {},
    create: { email: "hq@losev.org.tr", passwordHash, role: "HQ", fullName: "LÖSEV Genel Merkez", city: "Ankara", district: "Çankaya" },
  })
  console.log("✅ Genel Merkez kullanıcısı oluşturuldu")

  const teachers = [
    { email: "ogretmen1@losev.org.tr", fullName: "Ahmet Kaya", schoolId: school1.id, city: "İstanbul", district: "Kadıköy" },
    { email: "ogretmen2@losev.org.tr", fullName: "Fatma Demir", schoolId: school2.id, city: "Ankara", district: "Çankaya" },
    { email: "ogretmen3@losev.org.tr", fullName: "Mehmet Yıldız", schoolId: school3.id, city: "İzmir", district: "Bornova" },
  ]
  for (const t of teachers) {
    await prisma.user.upsert({ where: { email: t.email }, update: {}, create: { ...t, passwordHash, role: "TEACHER" } })
  }
  console.log("✅ Öğretmenler oluşturuldu")

  const students = [
    { email: "ogrenci1@losev.org.tr", fullName: "Elif Yılmaz", schoolId: school1.id, city: "İstanbul", district: "Kadıköy", grade: "10", coordinatorName: "Ahmet Kaya" },
    { email: "ogrenci2@losev.org.tr", fullName: "Can Öztürk", schoolId: school1.id, city: "İstanbul", district: "Kadıköy", grade: "11", coordinatorName: "Ahmet Kaya" },
    { email: "ogrenci3@losev.org.tr", fullName: "Zeynep Arslan", schoolId: school1.id, city: "İstanbul", district: "Kadıköy", grade: "9", coordinatorName: "Ahmet Kaya" },
    { email: "ogrenci4@losev.org.tr", fullName: "Ali Şahin", schoolId: school2.id, city: "Ankara", district: "Çankaya", grade: "12", coordinatorName: "Fatma Demir" },
    { email: "ogrenci5@losev.org.tr", fullName: "Merve Koç", schoolId: school2.id, city: "Ankara", district: "Çankaya", grade: "10", coordinatorName: "Fatma Demir" },
    { email: "ogrenci6@losev.org.tr", fullName: "Burak Aydın", schoolId: school2.id, city: "Ankara", district: "Çankaya", grade: "11", coordinatorName: "Fatma Demir" },
    { email: "ogrenci7@losev.org.tr", fullName: "Selin Çelik", schoolId: school3.id, city: "İzmir", district: "Bornova", grade: "10", coordinatorName: "Mehmet Yıldız" },
    { email: "ogrenci8@losev.org.tr", fullName: "Emre Kurt", schoolId: school3.id, city: "İzmir", district: "Bornova", grade: "12", coordinatorName: "Mehmet Yıldız" },
    { email: "ogrenci9@losev.org.tr", fullName: "Ayşe Polat", schoolId: school3.id, city: "İzmir", district: "Bornova", grade: "9", coordinatorName: "Mehmet Yıldız" },
  ]

  const createdStudents: Array<{ id: string; email: string }> = []
  for (const s of students) {
    const student = await prisma.user.upsert({ where: { email: s.email }, update: {}, create: { ...s, passwordHash, role: "STUDENT" } })
    createdStudents.push({ id: student.id, email: student.email })
  }
  console.log("✅ Öğrenciler oluşturuldu")

  const activityTypes = ["SEMINAR", "STAND", "DONATION", "FAIR", "SOCIAL_MEDIA", "VISIT", "EDUCATION", "OTHER"]
  const statuses = ["PENDING", "APPROVED", "REJECTED"]
  const now = new Date()
  const descriptions: Record<string, string> = {
    SEMINAR: "LÖSEV farkındalık semineri düzenlendi, öğrencilere lösemi hakkında bilgi verildi.",
    STAND: "Okul kantininde LÖSEV bilgilendirme standı kuruldu, broşürler dağıtıldı.",
    DONATION: "LÖSEV yararına bağış toplama kampanyası düzenlendi, aileler bilgilendirildi.",
    FAIR: "Okul bahçesinde LÖSEV yararına kermes düzenlendi, gelir vakfa aktarıldı.",
    SOCIAL_MEDIA: "LÖSEV sosyal medya farkındalık kampanyasına destek verildi, paylaşımlar yapıldı.",
    VISIT: "LÖSEV bünyesindeki aileye ziyaret gerçekleştirildi, moral desteği sağlandı.",
    EDUCATION: "LÖSEV eğitim programına katılım sağlanarak gönüllülük eğitimi alındı.",
    OTHER: "LÖSEV için çeşitli organizasyon faaliyetlerinde görev alındı.",
  }

  for (const student of createdStudents) {
    const numActivities = Math.floor(Math.random() * 5) + 3
    for (let i = 0; i < numActivities; i++) {
      const daysAgo = Math.floor(Math.random() * 180)
      const activityDate = new Date(now)
      activityDate.setDate(activityDate.getDate() - daysAgo)
      const status = statuses[Math.floor(Math.random() * 3)]!
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]!
      const hours = Math.min((Math.floor(Math.random() * 15) + 1) * 0.5, 8)

      const activity = await prisma.activity.create({
        data: { date: activityDate, type, hours, description: descriptions[type]!, status, studentId: student.id },
      })

      if (status !== "PENDING") {
        const studentData = await prisma.user.findUnique({ where: { id: student.id }, select: { schoolId: true } })
        if (studentData?.schoolId) {
          const teacher = await prisma.user.findFirst({ where: { role: "TEACHER", schoolId: studentData.schoolId } })
          if (teacher) {
            await prisma.activityReview.create({
              data: {
                decision: status,
                note: status === "APPROVED" ? "Faaliyet onaylanmıştır. Tebrikler!" : "Belge eksik, lütfen kanıt ekleyiniz.",
                activityId: activity.id,
                reviewerId: teacher.id,
              },
            })
          }
        }
      }
    }
  }

  console.log("✅ Faaliyetler ve incelemeler oluşturuldu")
  console.log("🎉 Seed tamamlandı!")
  console.log("")
  console.log("📧 Test Giriş Bilgileri:")
  console.log("   Genel Merkez: hq@losev.org.tr / Test1234!")
  console.log("   Öğretmen 1:   ogretmen1@losev.org.tr / Test1234!")
  console.log("   Öğrenci 1:    ogrenci1@losev.org.tr / Test1234!")
  console.log("   ... (tüm şifreler: Test1234!)")

  await prisma.$disconnect()
}

main().catch(async (e) => {
  console.error("❌ Seed hatası:", e)
  process.exit(1)
})
