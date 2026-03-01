import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { ActivityHistoryTable } from "@/components/activity/activity-history-table"
import type { ActivityWithDetails } from "@/types"
import Link from "next/link"
import { ArrowLeft, History } from "lucide-react"

export default async function ActivityHistoryPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Sadece öğrenciler faaliyet geçmişini görebilir
  if (session.user.role !== "STUDENT") {
    redirect("/dashboard")
  }

  // Öğrencinin faaliyetlerini getir
  const activities = await prisma.activity.findMany({
    where: {
      studentId: session.user.id,
    },
    orderBy: {
      date: "desc",
    },
    include: {
      student: {
        select: {
          id: true,
          fullName: true,
          grade: true,
          school: {
            select: {
              name: true,
            },
          },
        },
      },
      review: {
        include: {
          reviewer: {
            select: {
              fullName: true,
            },
          },
        },
      },
    },
  }) as ActivityWithDetails[]

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
            <History className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Faaliyet Geçmişi
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Bugüne kadar gerçekleştirdiğiniz tüm gönüllülük faaliyetlerinin listesi ve durumları.
            </p>
          </div>
        </div>
      </div>
      
      <div className="py-2">
        <ActivityHistoryTable activities={activities} />
      </div>
    </div>
  )
}
