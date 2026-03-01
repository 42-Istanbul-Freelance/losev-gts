import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { ActivityForm } from "@/components/activity/activity-form"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function NewActivityPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  // Sadece öğrenciler faaliyet ekleyebilir
  if (session.user.role !== "STUDENT") {
    redirect("/dashboard")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/dashboard"
          className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Faaliyet İşlemleri
        </h1>
      </div>
      
      <div className="py-2">
        <ActivityForm />
      </div>
    </div>
  )
}
