import { RegisterTeacherForm } from "@/components/auth/register-teacher-form"
import { prisma } from "@/lib/prisma"

export default async function TeacherRegisterPage() {
  const schools = await prisma.school.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true }
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-blue-50/30">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <RegisterTeacherForm schools={schools} />
      </div>
    </div>
  )
}
