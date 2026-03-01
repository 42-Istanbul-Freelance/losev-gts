import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Map as MapIcon, Navigation, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CityCharts } from "@/components/dashboard/city-charts"

interface CityData {
  city: string
  hours: number
  students: number
  schools: number
}

export default async function CitiesPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Sadece HQ rolü görebilir
  if (session.user.role !== "HQ" && session.user.role !== "TEACHER") {
    redirect("/dashboard")
  }

  // Tüm okulları ve içindeki onaylanmış öğrenci aktivitelerini getir
  const schools = await prisma.school.findMany({
    include: {
      users: {
        where: { role: "STUDENT" },
        include: {
          activities: {
            where: { status: "APPROVED" }
          }
        }
      }
    }
  })

  // İl bazlı gruplama ve hesaplama
  const cityMap = new Map<string, CityData>()

  schools.forEach(school => {
    const city = school.city

    if (!cityMap.has(city)) {
      cityMap.set(city, { city, hours: 0, students: 0, schools: 0 })
    }

    const cityData = cityMap.get(city)!
    cityData.schools += 1

    school.users.forEach(student => {
      // Sadece onaylanmış aktivitesi olan/veya kayıtlı öğrencileri say
      // Öğrencilerin onaylanmış toplam saati
      const studentHours = student.activities.reduce((sum, act) => sum + act.hours, 0)
      
      cityData.hours += studentHours
      if (studentHours > 0) {
        cityData.students += 1 // En az 1 saat faaliyeti olanları "Aktif Öğrenci" say
      }
    })
  })

  // Array'e çevir ve saat bazında sırala
  const cityRankings = Array.from(cityMap.values())
    .filter(c => c.hours > 0) // Hiç aktivitesi olmayan illeri listeden çıkar
    .sort((a, b) => b.hours - a.hours)

  // Toplam İstatistikler
  const totalActiveCities = cityRankings.length
  const topCity = cityRankings[0]

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
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
            <MapIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              İl Bazlı Analiz
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Bölgesel LÖSEV gönüllülük faaliyetlerinin dağılımı.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-emerald-100 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 opacity-50" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktif İl Sayısı</CardTitle>
            <Navigation className="h-5 w-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">{totalActiveCities}</div>
            <p className="text-xs text-gray-500 mt-1">Gönüllülük yapılan şehir</p>
          </CardContent>
        </Card>

        {topCity && (
          <Card className="border-blue-100 shadow-sm relative overflow-hidden lg:col-span-2">
            <div className="absolute right-0 top-0 w-32 h-32 bg-blue-50 rounded-bl-full -z-10 opacity-50" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">En Başarılı İl: <span className="text-blue-600 font-bold">{topCity.city}</span></CardTitle>
              <TrendingUp className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-6">
                <div>
                  <div className="text-3xl font-bold text-blue-600">{topCity.hours}<span className="text-xl font-semibold text-blue-400 ml-1">Saat</span></div>
                  <p className="text-xs text-gray-500 mt-1">Toplam Gönüllülük</p>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-slate-700">{topCity.students}</div>
                  <p className="text-xs text-gray-500 mt-1">Aktif Öğrenci</p>
                </div>
                <div className="hidden sm:block">
                  <div className="text-xl font-bold text-slate-700">{topCity.schools}</div>
                  <p className="text-xs text-gray-500 mt-1">Kulüplü Okul</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Şehirler Tablosu */}
        <Card className="col-span-4 border-gray-200">
          <CardHeader>
            <CardTitle>Şehir Sıralaması</CardTitle>
            <CardDescription>
              İllerin toplam gönüllülük saati ve öğrenci katılımına göre sıralaması.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-y-auto max-h-[500px]">
              {cityRankings.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Sistemde henüz veri bulunmuyor.</div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50 sticky top-0 z-10">
                    <tr>
                      <th className="px-4 py-3">#</th>
                      <th className="px-4 py-3">İl</th>
                      <th className="px-4 py-3 text-center">Okul</th>
                      <th className="px-4 py-3 text-center">Aktif Gönüllü</th>
                      <th className="px-4 py-3 text-right">Toplam Saat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {cityRankings.map((c, i) => (
                      <tr key={c.city} className="hover:bg-gray-50 bg-white">
                        <td className="px-4 py-3 font-medium text-gray-900 w-12 text-center text-xs">
                          {i + 1}
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          {c.city}
                        </td>
                        <td className="px-4 py-3 text-center text-gray-600">
                          {c.schools}
                        </td>
                         <td className="px-4 py-3 text-center text-blue-600 font-medium">
                          {c.students}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600 text-right">
                          {c.hours}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Görselleştirme Grafiği */}
        <Card className="col-span-3 border-gray-200">
          <CardHeader>
            <CardTitle>Gönüllü Dağılımı</CardTitle>
            <CardDescription>
              En çok saati olan ilk 10 il
            </CardDescription>
          </CardHeader>
          <CardContent>
             <CityCharts data={cityRankings.slice(0, 10).map(c => ({ name: c.city, value: c.hours }))} />
          </CardContent>
        </Card>
      </div>

    </div>
  )
}
