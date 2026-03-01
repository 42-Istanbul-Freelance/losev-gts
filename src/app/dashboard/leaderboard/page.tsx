import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Trophy, Medal, Building2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LeaderboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Sadece HQ rolü liderlik tablosunu görebilir (veya öğretmenler/öğrenciler için yetkilendirme esnetilebilir)
  if (session.user.role !== "HQ" && session.user.role !== "TEACHER") {
    redirect("/dashboard")
  }

  // Öğrencileri ve onaylanmış saatlerini getir
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      school: { select: { name: true, city: true } },
      activities: {
        where: { status: "APPROVED" },
        select: { hours: true }
      }
    }
  })

  // Okulları ve öğrencilerin saatlerini getir
  const schools = await prisma.school.findMany({
    include: {
      users: {
        where: { role: "STUDENT" },
        select: {
          activities: {
            where: { status: "APPROVED" },
            select: { hours: true }
          }
        }
      }
    }
  })

  // Öğrencileri sırala
  const rankedStudents = students.map(student => {
    const totalHours = student.activities.reduce((sum, act) => sum + act.hours, 0)
    
    let badge = "Yeni İnci"
    if (totalHours >= 100) badge = "Altın İnci"
    else if (totalHours >= 50) badge = "Gümüş İnci"
    else if (totalHours >= 25) badge = "Bronz İnci"

    return {
      id: student.id,
      name: student.fullName,
      school: student.school?.name || "Bilinmeyen Okul",
      city: student.school?.city || "-",
      hours: totalHours,
      badge
    }
  }).sort((a, b) => b.hours - a.hours).slice(0, 50) // Top 50

  // Okulları sırala
  const rankedSchools = schools.map(school => {
    const totalHours = school.users.reduce((acc, student) => {
      return acc + student.activities.reduce((sum, act) => sum + act.hours, 0)
    }, 0)

    return {
      id: school.id,
      name: school.name,
      city: school.city,
      district: school.district,
      studentsCount: school.users.length,
      hours: totalHours
    }
  }).sort((a, b) => b.hours - a.hours).slice(0, 20) // Top 20

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Liderlik Tabloları
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Türkiye geneli en aktif gönüllüler ve öğrenci kulüpleri.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Öğrenciler */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
            <div className="flex items-center gap-2">
              <Medal className="w-5 h-5 text-amber-500" />
              <div>
                <CardTitle className="text-xl">En Aktif Gönüllüler (Top 50)</CardTitle>
                <CardDescription>Türkiye geneli en çok saat gönüllülük yapan öğrenciler</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto max-h-[600px]">
              {rankedStudents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Sistemde henüz veri bulunmuyor.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Öğrenci</th>
                      <th className="px-4 py-3">Okul / İl</th>
                      <th className="px-4 py-3 text-right">Saat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rankedStudents.map((student, i) => (
                      <tr key={student.id} className="hover:bg-gray-50 bg-white">
                        <td className="px-4 py-3 font-medium text-gray-900 w-12 text-center">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.badge}</p>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-gray-900 truncate max-w-[200px]" title={student.school}>{student.school}</p>
                          <p className="text-xs text-gray-500">{student.city}</p>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900 text-right w-20">
                          {student.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Okullar */}
        <Card className="border-gray-200">
          <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-500" />
              <div>
                <CardTitle className="text-xl">En Başarılı Okullar (Top 20)</CardTitle>
                <CardDescription>Öğrencilerinin toplam gönüllülük saatine göre kulüpler</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto max-h-[600px]">
              {rankedSchools.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Sistemde henüz veri bulunmuyor.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">Okul</th>
                      <th className="px-4 py-3 text-center">Gönüllü Sayısı</th>
                      <th className="px-4 py-3 text-right">Toplam Saat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rankedSchools.map((school, i) => (
                      <tr key={school.id} className="hover:bg-gray-50 bg-white">
                        <td className="px-4 py-3 font-medium text-gray-900 w-12 text-center">
                          {i === 0 ? "🌟" : i === 1 ? "⭐" : i === 2 ? "✨" : i + 1}
                        </td>
                        <td className="px-4 py-3">
                          <p className="font-semibold text-gray-900 max-w-[220px] truncate" title={school.name}>{school.name}</p>
                          <p className="text-xs text-gray-500">{school.city}, {school.district}</p>
                        </td>
                        <td className="px-4 py-3 text-center font-medium text-gray-700">
                          {school.studentsCount}
                        </td>
                        <td className="px-4 py-3 font-bold text-orange-600 text-right w-24">
                          {school.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
