import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, Building, MapPin, TrendingUp, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"

interface HQOverviewProps {
  user: {
    name?: string | null
  }
}

export async function HQOverview({ user }: HQOverviewProps) {
  // Veritabanından gerçek istatistikleri çek
  const [
    totalStudentsCount,
    totalSchoolsCount,
    allActivities,
    pendingActivitiesCount,
    topSchools
  ] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.school.count(),
    prisma.activity.findMany({
      where: { status: "APPROVED" },
      select: { hours: true, type: true }
    }),
    prisma.activity.count({ where: { status: "PENDING" } }),
    prisma.school.findMany({
      take: 4,
      include: {
        users: {
          select: {
            activities: {
              where: { status: "APPROVED" },
              select: { hours: true }
            }
          }
        }
      }
    })
  ])

  // Toplam saat hesapla
  const totalApprovedHours = allActivities.reduce((acc, curr) => acc + curr.hours, 0)

  // En iyi okulları saat bazında hesapla ve sırala
  const formattedTopSchools = topSchools.map(school => {
    const schoolTotalHours = school.users.reduce((acc, student) => {
      const studentHours = student.activities.reduce((sum, act) => sum + act.hours, 0)
      return acc + studentHours
    }, 0)

    return {
      name: school.name,
      city: school.city,
      hours: schoolTotalHours,
      studentsCount: school.users.length
    }
  }).sort((a, b) => b.hours - a.hours)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Merhaba, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500">
          Türkiye geneli tüm LÖSEV lise kulüplerinin gönüllülük istatistikleri.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-orange-50 rounded-bl-full -z-10 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Toplam Gönüllü Süresi</CardTitle>
            <Clock className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{totalApprovedHours}<span className="text-xl font-semibold text-orange-400 ml-1">Saat</span></div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <TrendingUp className="w-3 h-3 mr-1 text-green-500" /> Türkiye geneli onaylanan
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-blue-50 rounded-bl-full -z-10 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktif Genç Gönüllü</CardTitle>
            <Users className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{totalStudentsCount}</div>
            <p className="text-xs text-gray-500 mt-1">Sisteme kayıtlı lise öğrencisi</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -z-10 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">LÖSEV Kulüplü Okul</CardTitle>
            <Building className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{totalSchoolsCount}</div>
            <p className="text-xs text-gray-500 mt-1 flex items-center">
              <MapPin className="w-3 h-3 mr-1" /> 81 il genelinde
            </p>
          </CardContent>
        </Card>

        <Card className="border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-red-50 rounded-bl-full -z-10 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Sistemde Bekleyen</CardTitle>
            <AlertCircle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{pendingActivitiesCount}</div>
            <p className="text-xs text-gray-500 mt-1">Öğretmen onayı bekleyen işlem</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        
        {/* Turkey Map placeholder or general chart */}
        <Card className="col-span-4 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Türkiye Geneli Görünüm</CardTitle>
              <CardDescription>
                Şehir bazlı aktivite yoğunluğu ve istatistiklerine hızlı bakış.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/cities">Detaylı Rapor</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center p-6 text-center">
              <MapPin className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-slate-600 font-medium text-lg">İl Bazlı Analiz Yakında</h3>
              <p className="text-sm text-slate-400 mt-1 max-w-sm">
                Harita destekli şehir kırılımı ve bölgesel analiz modülü yapılandırılıyor. Görüntülemek için menüden İl Analizi sekmesine geçebilirsiniz.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Top Schools List */}
        <Card className="col-span-3 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>En Aktif Okullar</CardTitle>
              <CardDescription>
                Toplam gönüllülük süresine göre lider okullar.
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700" asChild>
              <Link href="/dashboard/leaderboard">Tam Liste</Link>
            </Button>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {formattedTopSchools.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500">
                  Sistemde henüz yeterli veri yok.
                </div>
              ) : (
                formattedTopSchools.map((school, i) => (
                  <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                        i === 0 ? 'bg-yellow-500 text-white' :
                        i === 1 ? 'bg-gray-400 text-white' :
                        i === 2 ? 'bg-amber-600 text-white' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold leading-none text-gray-800 line-clamp-1">{school.name}</p>
                        <p className="text-xs text-gray-500">{school.city} • {school.studentsCount} Öğrenci</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-sm text-gray-900">{school.hours}s</span>
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
