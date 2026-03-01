import { RegisterStudentForm } from "@/components/auth/register-student-form"
import { prisma } from "@/lib/prisma"

export default async function StudentRegisterPage() {
  const schools = await prisma.school.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  })
  
  const teachers = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { id: true, fullName: true, schoolId: true }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-orange-50/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <RegisterStudentForm schools={schools} teachers={teachers} />
      </div>
    </div>
  )
}
