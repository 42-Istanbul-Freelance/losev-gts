import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, CheckSquare, Building } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface TeacherOverviewProps {
  user: {
    name?: string | null
    schoolName?: string | null
  }
}

export async function TeacherOverview({ user }: TeacherOverviewProps) {
  // In a real application, fetch stats from the database here
  // For now, these are placeholder statistics
  const stats = {
    totalStudents: 145,
    pendingApprovals: 12,
    totalHoursThisMonth: 86.5,
    activeStudentsThisMonth: 34,
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Merhaba Hocam, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500">
          {user.schoolName} okulundaki LÖSEV gönüllülük faaliyetlerinin özeti.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bekleyen Onaylar</CardTitle>
            <CheckSquare className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.pendingApprovals}</div>
            <p className="text-xs text-gray-500 mt-1">İncelenmeyi bekleyen faaliyet</p>
          </CardContent>
        </Card>

        <Card className="border-orange-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bu Ayki Toplam Süre</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalHoursThisMonth} Saat</div>
            <p className="text-xs text-gray-500 mt-1">Onaylanmış gönüllülük süresi</p>
          </CardContent>
        </Card>

        <Card className="border-green-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Kayıtlı Öğrenciler</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">LÖSEV kulübüne kayıtlı öğrenci</p>
          </CardContent>
        </Card>

        <Card className="border-purple-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Aktif Öğrenciler</CardTitle>
            <Building className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.activeStudentsThisMonth}</div>
            <p className="text-xs text-gray-500 mt-1">Bu ay faaliyet giren öğrenci sayısı</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Bekleyen Faaliyet Onayları</CardTitle>
              <CardDescription>
                Öğrencilerinizin sisteme girdiği ve onayınızı bekleyen son faaliyetler.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" className="hidden sm:flex" asChild>
              <Link href="/dashboard/approvals">Tümünü Gör</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Dummy data for layout presentation */}
              {[
                { student: "Ayşe Yılmaz", grade: "10-A", type: "LÖSEV Stand Görevi", date: "12 Mar 2026", hours: 4 },
                { student: "Mehmet Demir", grade: "11-C", type: "Farkındalık Semineri", date: "08 Mar 2026", hours: 2 },
                { student: "Zeynep Çelik", grade: "9-B", type: "Kermes Organizasyonu", date: "02 Mar 2026", hours: 6.5 },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.student} <span className="text-xs text-gray-500">({activity.grade})</span></p>
                    <p className="text-xs text-gray-500">{activity.type} • {activity.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold w-12 text-right">{activity.hours}s</span>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-xs h-7">İncele</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-gray-200">
          <CardHeader>
            <CardTitle>En Aktif Öğrenciler (Bu Ay)</CardTitle>
            <CardDescription>
              Okulunuzda bu ay en çok gönüllülük yapan öğrenciler.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {[
                { student: "Zeynep Çelik", grade: "9-B", hours: 14.5, badge: "Gümüş İnci" },
                { student: "Ayşe Yılmaz", grade: "10-A", hours: 12.0, badge: "Bronz İnci" },
                { student: "Ali Veli", grade: "12-D", hours: 8.5, badge: "Yeni İnci" },
              ].map((student, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                      {i + 1}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">{student.student}</p>
                      <p className="text-xs text-gray-500">{student.badge}</p>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-gray-700">
                    {student.hours}s
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
