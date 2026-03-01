import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, PieChart as PieChartIcon, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HQCharts } from "@/components/hq/hq-charts"

export default async function HQAnalyticsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "HQ") {
    redirect("/dashboard")
  }

  // Fetch approved activities
  const activities = await prisma.activity.findMany({
    where: { status: "APPROVED" },
    select: {
      type: true,
      hours: true,
      date: true,
    }
  })

  // 1. Faaliyet Türlerine Göre Dağılım Hesaplaması
  const typeMap = new Map<string, number>()
  activities.forEach(act => {
    const current = typeMap.get(act.type) || 0
    typeMap.set(act.type, current + act.hours)
  })

  const typeData = Array.from(typeMap.entries()).map(([name, value]) => ({
    name,
    value
  }))

  // 2. Aylık Gönüllülük Trendi Hesaplaması (Son 6 Ay)
  const monthMap = new Map<string, number>()
  
  // Son 6 ayın string key'lerini oluştur (örn: "Oca", "Şub")
  const today = new Date()
  const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"]
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
    monthMap.set(`${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`, 0)
  }

  activities.forEach(act => {
    const d = new Date(act.date)
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear().toString().slice(2)}`
    
    if (monthMap.has(key)) {
      monthMap.set(key, monthMap.get(key)! + act.hours)
    }
  })

  const trendData = Array.from(monthMap.entries()).map(([name, value]) => ({
    name,
    value
  }))

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
            <PieChartIcon className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Genel İstatistikler
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Faaliyet türü dağılımları ve dönemsel gönüllülük trendleri.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-600" />
            Grafiksel Görünüm
          </CardTitle>
          <CardDescription>
            Onaylanmış toplam faaliyet saatlerinin tür bazlı payı ve aylık periyotlara göre gelişimi.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <HQCharts typeData={typeData} trendData={trendData} />
        </CardContent>
      </Card>
    </div>
  )
}
