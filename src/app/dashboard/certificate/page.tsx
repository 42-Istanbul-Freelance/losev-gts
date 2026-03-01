import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ArrowLeft, Award, Lock } from "lucide-react"
import { Certificate } from "@/components/dashboard/certificate"
import { CERTIFICATE_THRESHOLD } from "@/lib/constants"

export default async function CertificatePage() {
  const session = await auth()

  if (!session?.user || session.user.role !== "STUDENT") {
    redirect("/dashboard")
  }

  // Öğrencinin onaylı saatlerini topla
  const student = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      activities: {
        where: { status: "APPROVED" },
        select: { hours: true }
      }
    }
  })

  if (!student) {
    redirect("/login")
  }

  const totalHours = student.activities.reduce((acc, curr) => acc + curr.hours, 0)
  const isEligible = totalHours >= CERTIFICATE_THRESHOLD

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
          <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              Gönüllülük Sertifikası
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Topluma değer katan emeğinizin resmi belgesi.
            </p>
          </div>
        </div>
      </div>

      <div className="py-6">
        {isEligible ? (
          <Certificate studentName={student.fullName} hours={totalHours} />
        ) : (
          <div className="max-w-xl mx-auto flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-white shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 text-gray-400">
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sertifika Henüz Açılmadı</h2>
            <p className="text-gray-500 text-lg mb-8">
              Sertifika oluşturabilmek için en az <strong className="text-gray-800">{CERTIFICATE_THRESHOLD} saat</strong> onaylanmış gönüllülük faaliyetine ihtiyacınız var.
              Şu ana kadar toplam <strong className="text-orange-600">{totalHours} saat</strong> tamamladınız.
            </p>
            <div className="w-full bg-gray-100 rounded-full h-3 mb-4 overflow-hidden">
              <div 
                className="bg-orange-500 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${Math.min((totalHours / CERTIFICATE_THRESHOLD) * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm font-medium text-gray-600 uppercase tracking-widest">
              Hedefe Son {CERTIFICATE_THRESHOLD - totalHours} Saat!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
