import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Building2, MapPin, Users, GraduationCap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddSchoolDialog } from "@/components/hq/add-school-dialog"

export default async function HQSchoolsPage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "HQ") {
    redirect("/dashboard")
  }

  // Get all schools with their student and teacher counts
  const schools = await prisma.school.findMany({
    include: {
      users: {
        select: {
          role: true,
          activities: {
            where: { status: "APPROVED" },
            select: { hours: true }
          }
        }
      }
    },
    orderBy: {
      name: "asc"
    }
  })

  // Format the data
  const formattedSchools = schools.map(school => {
    let studentCount = 0
    let teacherCount = 0
    let totalHours = 0

    school.users.forEach(user => {
      if (user.role === "STUDENT") {
        studentCount++
        totalHours += user.activities.reduce((sum, act) => sum + act.hours, 0)
      } else if (user.role === "TEACHER") {
        teacherCount++
      }
    })

    return {
      id: school.id,
      name: school.name,
      city: school.city,
      district: school.district,
      studentCount,
      teacherCount,
      totalHours
    }
  })

  const totalSchools = formattedSchools.length
  const totalStudents = formattedSchools.reduce((acc, curr) => acc + curr.studentCount, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Okul / Lise Yönetimi
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sisteme kayıtlı lise kulüplerini görüntüleyin veya yeni okul kaydedin.
            </p>
          </div>
        </div>
        <div>
          <AddSchoolDialog />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-indigo-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Toplam Okul</CardTitle>
            <Building2 className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-600">{totalSchools}</div>
            <p className="text-xs text-gray-500 mt-1">Türkiye Geneli</p>
          </CardContent>
        </Card>

        <Card className="border-blue-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Öğrenci Sayısı</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{totalStudents}</div>
            <p className="text-xs text-gray-500 mt-1">Kayıtlı liseli gönüllüler</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-gray-200">
        <CardHeader>
          <CardTitle>Lise Listesi</CardTitle>
          <CardDescription>
            Tüm kayıtlı okullar, bulundukları il/ilçe ve öğrenci sayıları.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            {formattedSchools.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-dashed text-gray-300">
                  <Building2 className="w-8 h-8" />
                </div>
                <p className="text-gray-500">Sistemde henüz kayıtlı okul yok.</p>
                <div className="mt-4">
                  <AddSchoolDialog />
                </div>
              </div>
            ) : (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-y border-gray-200">
                  <tr>
                    <th className="px-6 py-4 font-medium">Okul Adı</th>
                    <th className="px-6 py-4 font-medium">İl / İlçe</th>
                    <th className="px-6 py-4 font-medium text-center">Öğrenci K.</th>
                    <th className="px-6 py-4 font-medium text-center">Öğretmen / Koor.</th>
                    <th className="px-6 py-4 font-medium text-right">Toplam Gönüllülük</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {formattedSchools.map((school) => (
                    <tr key={school.id} className="hover:bg-gray-50 bg-white group">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-gray-900 line-clamp-1" title={school.name}>{school.name}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-gray-600 gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          <span>{school.city}, {school.district}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                         <span className={`inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full ${school.studentCount > 0 ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                           <Users className="w-3 h-3 mr-1" />
                           {school.studentCount}
                         </span>
                      </td>
                      <td className="px-6 py-4 text-center text-gray-600">
                        {school.teacherCount > 0 ? (
                           <span className="font-medium">{school.teacherCount}</span>
                        ) : (
                          <span className="text-red-500 font-medium text-xs">Atanmamış</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-emerald-600">{school.totalHours}</span> <span className="text-gray-400 text-xs">s</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
