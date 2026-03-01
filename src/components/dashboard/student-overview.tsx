import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Clock, FileText, CheckCircle2 } from "lucide-react"

interface StudentOverviewProps {
  user: {
    name?: string | null
    schoolName?: string | null
  }
}

export async function StudentOverview({ user }: StudentOverviewProps) {
  // In a real application, fetch stats from the database here
  // For now, these are placeholder statistics
  const stats = {
    totalHours: 12.5,
    pendingActivities: 2,
    completedActivities: 5,
    currentBadge: "Bronz",
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Merhaba, {user.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500">
          İşte LÖSEV gönüllülük faaliyetlerinin güncel özeti.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Toplam Saat</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.totalHours} Saat</div>
            <p className="text-xs text-gray-500 mt-1">Onaylanan faaliyetler</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Faaliyet Sayısı</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.completedActivities}</div>
            <p className="text-xs text-gray-500 mt-1">Tamamlanan etkinlik</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Rozet Seviyesi</CardTitle>
            <Award className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.currentBadge}</div>
            <p className="text-xs text-gray-500 mt-1">Bir sonraki rozete 12.5 saat kaldı</p>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bekleyenler</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{stats.pendingActivities}</div>
            <p className="text-xs text-gray-500 mt-1">Onay bekleyen faaliyet</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200">
          <CardHeader>
            <CardTitle>Son Faaliyetlerim</CardTitle>
            <CardDescription>
              Bu ay içerisinde eklediğiniz faaliyetlerin durumu.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Dummy data for layout presentation */}
              {[
                { type: "LÖSEV Stand Görevi", date: "12 Mar 2026", status: "Onaylandı", hours: 4 },
                { type: "Farkındalık Semineri", date: "08 Mar 2026", status: "Bekliyor", hours: 2 },
                { type: "Kermes Organizasyonu", date: "02 Mar 2026", status: "Onaylandı", hours: 6.5 },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span 
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        activity.status === "Onaylandı" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {activity.status}
                    </span>
                    <span className="text-sm font-bold w-12 text-right">{activity.hours}s</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-gray-200">
          <CardHeader>
            <CardTitle>Yeni Faaliyet Ekle</CardTitle>
            <CardDescription>
              Gönüllülük çalışmalarınızı sisteme hızlıca kaydedin.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center h-[200px]">
            <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-sm text-gray-500 mb-4 px-4">
              Okul etkinlikleri, seminerler ve projelerde geçirdiğiniz gönüllülük saatlerini ekleyerek rozetlerinizi artırın.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
