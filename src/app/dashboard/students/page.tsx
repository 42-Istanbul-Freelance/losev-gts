import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Users, Mail, Phone, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function TeacherStudentsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "TEACHER") {
    redirect("/dashboard")
  }

  // Öğretmenin okulundaki öğrencileri getir
  const teacher = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { schoolId: true }
  })

  if (!teacher?.schoolId) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold">Bir okula atanmamışsınız.</h2>
        <p className="text-gray-500 mt-2">Lütfen sistem yöneticisi ile iletişime geçin.</p>
      </div>
    )
  }

  const students = await prisma.user.findMany({
    where: { 
      role: "STUDENT",
      schoolId: teacher.schoolId
    },
    include: {
      activities: {
        where: { status: "APPROVED" },
        select: { hours: true }
      }
    },
    orderBy: {
      fullName: "asc"
    }
  })

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
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Öğrenciler
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Okulunuza kayıtlı olan tüm LÖSEV gönüllüsü öğrenciler.
            </p>
          </div>
        </div>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Gönüllü Öğrenci Listesi ({students.length})</CardTitle>
          <CardDescription>
            Öğrencilerinizin iletişim bilgilerini ve toplam onaylanan gönüllülük saatlerini inceleyebilirsiniz.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {students.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Okulunuza kayıtlı henüz hiçbir öğrenci bulunmuyor.
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Öğrenci Adı</th>
                    <th className="px-6 py-4 font-medium">Sınıf</th>
                    <th className="px-6 py-4 font-medium">İletişim</th>
                    <th className="px-6 py-4 font-medium text-right">Onaylı Gönüllülük</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students.map((student) => {
                    const totalHours = student.activities.reduce((sum, act) => sum + act.hours, 0)
                    return (
                      <tr key={student.id} className="hover:bg-gray-50 bg-white">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900">{student.fullName}</p>
                          {student.tcNo && <p className="text-xs text-gray-500 mt-0.5">T.C: {student.tcNo.substring(0, 3)}••••••••</p>}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className="bg-slate-50 text-slate-600 font-medium">
                            <GraduationCap className="w-3 h-3 mr-1" />
                            {student.grade ? `${student.grade}. Sınıf` : "Belirtilmemiş"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-1 text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="w-3.5 h-3.5" />
                              <a href={`mailto:${student.email}`} className="hover:text-orange-600 truncate max-w-[200px]" title={student.email}>
                                {student.email}
                              </a>
                            </div>
                            {student.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{student.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="inline-flex items-center justify-end font-bold text-gray-900 text-base">
                            <span className={totalHours >= 40 ? "text-green-600" : ""}>
                              {totalHours}
                            </span>
                            <span className="text-xs text-gray-500 font-normal ml-1 mt-1">Saat</span>
                          </div>
                          {totalHours >= 40 && (
                            <p className="text-[10px] text-green-600 font-medium mt-1">Sertifika Hak Edişi ✅</p>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
