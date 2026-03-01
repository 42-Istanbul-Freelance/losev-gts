import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { StudentOverview } from "@/components/dashboard/student-overview"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  const role = session.user.role

  if (role === "STUDENT") {
    return <StudentOverview user={session.user} />
  }

  if (role === "TEACHER") {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Öğretmen Paneli</h2>
        <p className="mt-2 text-gray-500">Çok yakında hizmetinizde.</p>
      </div>
    )
  }

  if (role === "HQ") {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Genel Merkez Paneli</h2>
        <p className="mt-2 text-gray-500">Çok yakında hizmetinizde.</p>
      </div>
    )
  }

  return <div>Yetkisiz erişim.</div>
}
