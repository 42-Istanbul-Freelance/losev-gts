import { Loader2 } from "lucide-react"

export default function DashboardLoading() {
  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-25" />
        <div className="relative bg-white p-4 rounded-full shadow-sm border border-orange-100 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-orange-500 animate-spin" />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-medium text-gray-900">Yükleniyor...</h3>
        <p className="text-sm text-gray-500 max-w-[250px]">Lütfen bekleyin, verileriniz güvenli bir şekilde getiriliyor.</p>
      </div>
    </div>
  )
}
