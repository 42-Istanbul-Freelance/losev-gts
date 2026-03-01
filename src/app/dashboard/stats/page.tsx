import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, BarChart3, Users, Clock, Award } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SchoolStatsCharts } from "@/components/dashboard/school-stats-charts"

export default async function SchoolStatsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  if (session.user.role !== "TEACHER") {
    redirect("/dashboard")
  }

  if (!session.user.schoolId) {
    return <div>Okul bilginiz bulunamadı.</div>
  }

  // Okul bilgilerini getir
  const school = await prisma.school.findUnique({
    where: { id: session.user.schoolId }
  })

  // Okuldaki tüm onaylanmış faaliyetleri getir
  const approvedActivities = await prisma.activity.findMany({
    where: {
      status: "APPROVED",
      student: {
        schoolId: session.user.schoolId
      }
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          grade: true
        }
      }
    }
  })

  // İstatistikleri hesapla
  let totalHours = 0
  const activeStudentsMap = new Map()
  const currentMonth = new Date().getMonth()
  let currentMonthHours = 0
  
  // Faaliyet türlerine göre dağılım
  const typeDistribution: Record<string, number> = {}
  
  // Sınıflara göre dağılım
  const gradeDistribution: Record<string, number> = {}

  approvedActivities.forEach(activity => {
    totalHours += activity.hours
    
    // Öğrencinin toplam saatini kaydet
    const studentHours = activeStudentsMap.get(activity.studentId) || 0
    activeStudentsMap.set(activity.studentId, studentHours + activity.hours)
    activeStudentsMap.set(`${activity.studentId}_name`, activity.student.fullName)
    activeStudentsMap.set(`${activity.studentId}_grade`, activity.student.grade)

    // Bu ayın faaliyeti mi kontrol et
    if (activity.date.getMonth() === currentMonth) {
      currentMonthHours += activity.hours
    }

    // Tür bazlı dağılım
    typeDistribution[activity.type] = (typeDistribution[activity.type] || 0) + activity.hours

    // Sınıf bazlı dağılım
    const grade = activity.student.grade || "Bilinmiyor"
    gradeDistribution[grade] = (gradeDistribution[grade] || 0) + activity.hours
  })

  const totalActiveStudents = Array.from(activeStudentsMap.keys()).filter(k => !k.endsWith("_name") && !k.endsWith("_grade")).length

  // En aktif ilk 5 öğrenciyi bul
  const topStudents = Array.from(activeStudentsMap.keys())
    .filter(k => !k.endsWith("_name") && !k.endsWith("_grade"))
    .map(studentId => {
      const hours = activeStudentsMap.get(studentId)
      let badge = "Yeni İnci"
      if (hours >= 100) badge = "Altın İnci"
      else if (hours >= 50) badge = "Gümüş İnci"
      else if (hours >= 25) badge = "Bronz İnci"

      return {
        id: studentId,
        name: activeStudentsMap.get(`${studentId}_name`),
        grade: activeStudentsMap.get(`${studentId}_grade`),
        hours: hours,
        badge: badge
      }
    })
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 5)

  // Chart datalarını hazırla
  const typeChartData = Object.entries(typeDistribution).map(([name, value]) => ({ name, value }))
  const gradeChartData = Object.entries(gradeDistribution).map(([name, value]) => ({ name, value }))

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
          <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Okul İstatistikleri
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {school?.name} öğrencilerinin gönüllülük performansı ve detaylı analizleri.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Toplam Gönüllülük</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{totalHours} Saat</div>
            <p className="text-xs text-gray-500 mt-1">Onaylanmış tüm faaliyetler</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gönüllü Öğrenci</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalActiveStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Faaliyet giren öğrenci sayısı</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Eğitim Öğretim Yılı</CardTitle>
            <Award className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{(totalHours / (totalActiveStudents || 1)).toFixed(1)} Saat</div>
            <p className="text-xs text-gray-500 mt-1">Öğrenci başı ortalama süre</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bu Ay Eklendi</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{currentMonthHours} Saat</div>
            <p className="text-xs text-gray-500 mt-1">İçinde bulunduğumuz ay onaylanan</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 border-gray-200">
          <CardHeader>
            <CardTitle>Genel Dağılım Grafikleri</CardTitle>
            <CardDescription>
              Faaliyet türlerine ve sınıflara göre okuldaki gönüllülük dağılımı.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SchoolStatsCharts typeData={typeChartData} gradeData={gradeChartData} />
          </CardContent>
        </Card>

        <Card className="col-span-3 border-gray-200">
          <CardHeader>
            <CardTitle>Onur Tablosu (Top 5)</CardTitle>
            <CardDescription>
              Okulunuzda en fazla gönüllülük süresine sahip ekin öğrenciler.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {topStudents.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Henüz onaylanmış gönüllü faaliyeti bulunmuyor.
                </div>
              ) : (
                topStudents.map((student, i) => (
                  <div key={student.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                        i === 0 ? 'bg-yellow-500 text-lg' :
                        i === 1 ? 'bg-gray-400' :
                        i === 2 ? 'bg-amber-600' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold leading-none text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">{student.grade}. Sınıf • {student.badge}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-bold text-gray-900">{student.hours}</span>
                      <span className="text-xs text-gray-500 ml-1">Saat</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
