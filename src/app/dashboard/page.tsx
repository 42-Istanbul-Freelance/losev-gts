import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { StudentOverview } from "@/components/dashboard/student-overview"

import { TeacherOverview } from "@/components/dashboard/teacher-overview"

import { HQOverview } from "@/components/dashboard/hq-overview"

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
    return <TeacherOverview user={session.user} />
  }

  if (role === "HQ") {
    return <HQOverview user={session.user} />
  }

  return <div>Yetkisiz erişim.</div>
}
