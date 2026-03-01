import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ApprovalTable } from "@/components/dashboard/approval-table"
import Link from "next/link"
import { ArrowLeft, CheckSquare } from "lucide-react"

export default async function ApprovalsPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Sadece öğretmenler onay bekleyenleri görebilir
  if (session.user.role !== "TEACHER") {
    redirect("/dashboard")
  }

  if (!session.user.schoolId) {
    return <div>Okul bilginiz bulunamadı. Lütfen yöneticiyle iletişime geçin.</div>
  }

  // Öğretmenin okulundaki öğrencilerin BÜTÜN BEKLEYEN faaliyetlerini getir
  const pendingActivities = await prisma.activity.findMany({
    where: {
      status: "PENDING",
      student: {
        schoolId: session.user.schoolId
      }
    },
    orderBy: {
      date: "desc",
    },
    include: {
      student: {
        select: {
          fullName: true,
          grade: true,
        },
      },
    },
  })

  // Prisma nesnelerini düz javascript nesnelerine çevir (Client Component'e pass etmek için daha güvenli)
  const activities = pendingActivities.map(activity => ({
    id: activity.id,
    date: activity.date,
    type: activity.type,
    hours: activity.hours,
    description: activity.description,
    attachmentUrl: activity.attachmentUrl,
    student: {
      fullName: activity.student.fullName,
      grade: activity.student.grade,
    }
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
          <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Bekleyen Onaylar
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Öğrencilerinizin gönderdiği gönüllülük faaliyetlerini inceleyin ve onaylayın.
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        <ApprovalTable activities={activities} />
      </div>
    </div>
  )
}
