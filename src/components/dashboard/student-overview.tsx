import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Clock, FileText, CheckCircle2, Lock, Download } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { CERTIFICATE_THRESHOLD, BADGE_LEVELS } from "@/lib/constants"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface StudentOverviewProps {
  user: {
    id?: string | null
    name?: string | null
    schoolName?: string | null
  }
}

export async function StudentOverview({ user }: StudentOverviewProps) {
  if (!user.id) return null

  // Fetch actual student data from the database
  const student = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      activities: {
        orderBy: { date: "desc" }
      }
    }
  })

  if (!student) return null

  const activities = student.activities
  const approvedActivities = activities.filter(a => a.status === "APPROVED")
  const pendingActivities = activities.filter(a => a.status === "PENDING")
  
  const totalHours = approvedActivities.reduce((acc, curr) => acc + curr.hours, 0)
  
  // Determine badge
  let currentBadge: any = BADGE_LEVELS.NEW
  let nextBadge: any = BADGE_LEVELS.BRONZE

  if (totalHours >= BADGE_LEVELS.GOLD.min) {
    currentBadge = BADGE_LEVELS.GOLD
    nextBadge = BADGE_LEVELS.GOLD // Max level reached
  } else if (totalHours >= BADGE_LEVELS.SILVER.min) {
    currentBadge = BADGE_LEVELS.SILVER
    nextBadge = BADGE_LEVELS.GOLD
  } else if (totalHours >= BADGE_LEVELS.BRONZE.min) {
    currentBadge = BADGE_LEVELS.BRONZE
    nextBadge = BADGE_LEVELS.SILVER
  }

  const hoursToNextBadge = Math.max(0, nextBadge.min - totalHours)
  const isCertificateEligible = totalHours >= CERTIFICATE_THRESHOLD
  const recentActivities = activities.slice(0, 5)

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
            <div className="text-2xl font-bold text-orange-600">{totalHours} Saat</div>
            <p className="text-xs text-gray-500 mt-1">Onaylanan faaliyetler</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Faaliyet Sayısı</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{approvedActivities.length}</div>
            <p className="text-xs text-gray-500 mt-1">Tamamlanan etkinlik</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-100 shadow-sm overflow-hidden relative">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
            <CardTitle className="text-sm font-medium text-gray-600">Rozet Seviyesi</CardTitle>
            <span className="text-xl" title={currentBadge.label}>{currentBadge.icon}</span>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-yellow-600 tracking-tight">{currentBadge.label}</div>
            {hoursToNextBadge > 0 ? (
              <p className="text-[11px] text-gray-500 mt-1 font-medium">Bir sonrakine {hoursToNextBadge} saat kaldı.</p>
            ) : (
              <p className="text-[11px] text-gray-500 mt-1 font-medium">En yüksek seviyeye ulaştın! 🏆</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Bekleyenler</CardTitle>
            <FileText className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-700">{pendingActivities.length}</div>
            <p className="text-xs text-gray-500 mt-1">Onay bekleyen faaliyet</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Son Faaliyetlerim</CardTitle>
              <CardDescription>
                Sisteme eklediğiniz son faaliyet kayıtları.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/activity/history">Tümünü Gör</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-6 text-sm text-gray-500">
                  Henüz bir faaliyet eklemediniz.
                </div>
              ) : (
                recentActivities.map((activity, i) => (
                  <div key={activity.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-800 leading-none">
                        {activity.type === "SEMINAR" ? "Seminer" :
                         activity.type === "STAND" ? "LÖSEV Stant Görevi" :
                         activity.type === "DONATION" ? "Bağış Toplama" :
                         activity.type === "FAIR" ? "Kermes" :
                         activity.type === "SOCIAL_MEDIA" ? "Sosyal Medya" :
                         activity.type === "VISIT" ? "Ziyaret" :
                         activity.type === "EDUCATION" ? "Eğitim" : "Diğer Faaliyet"}
                      </p>
                      <p className="text-xs font-medium text-gray-500">{format(new Date(activity.date), "dd MMM yyyy", { locale: tr })}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span 
                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                          activity.status === "APPROVED" 
                            ? "bg-green-100 text-green-700" 
                            : activity.status === "REJECTED"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {activity.status === "APPROVED" ? "Onaylandı" : activity.status === "REJECTED" ? "Reddedildi" : "Bekliyor"}
                      </span>
                      <span className="text-sm font-bold text-gray-900 w-12 text-right">{activity.hours}s</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-3 space-y-4">
          <Card className={`${isCertificateEligible ? "border-green-200 bg-green-50/50" : "border-gray-200"} h-auto`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className={`w-5 h-5 ${isCertificateEligible ? "text-green-600" : "text-gray-400"}`} />
                Dijital Sertifika
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 text-center">
              {isCertificateEligible ? (
                <>
                  <p className="text-sm text-green-800 font-medium mb-4">
                    Tebrikler! {CERTIFICATE_THRESHOLD} saat hedefini geçtin ve LÖSEV Gönüllülük Sertifikası'nı almaya hak kazandın.
                  </p>
                  <Button className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                    <Link href="/dashboard/certificate">
                      <Download className="w-4 h-4 mr-2" />
                      Sertifikanı İndir
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                   <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4 border border-gray-200">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4 px-2">
                    Gönüllülük saatini <strong className="text-gray-800">{CERTIFICATE_THRESHOLD} saatin</strong> üzerine çıkardığında dijital sertifikan otomatik olarak açılacak.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.min((totalHours / CERTIFICATE_THRESHOLD) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 font-medium mt-2">
                    Son {CERTIFICATE_THRESHOLD - totalHours} Saat!
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card className="border-gray-200">
             <CardHeader className="py-4">
              <CardTitle className="text-base text-gray-800 flex items-center gap-2">
                 <FileText className="w-4 h-4 text-orange-500" />
                 Hızlı İşlem
              </CardTitle>
             </CardHeader>
             <CardContent className="px-6 pb-6 pt-0">
               <Button className="w-full text-sm h-10 tracking-wide font-semibold shadow-sm" variant="default" asChild>
                  <Link href="/dashboard/activity/new">
                    + Faaliyet Ekle
                  </Link>
               </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

