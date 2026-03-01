"use client"

import { useEffect } from "react"
import { AlertCircle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Dashboard Render Error:", error)
  }, [error])

  return (
    <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-6 text-center">
      <div className="bg-red-50 p-6 rounded-full">
        <AlertCircle className="h-12 w-12 text-red-500" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Bir Şeyler Ters Gitti
        </h2>
        <p className="text-gray-500 max-w-[400px]">
          Verileri yüklerken beklenmedik bir hata oluştu. Lütfen bağlantınızı kontrol edip sayfayı yenileyin.
        </p>
      </div>
      <Button 
        onClick={() => reset()} 
        className="bg-orange-600 hover:bg-orange-700 text-white gap-2"
      >
        <RotateCcw className="w-4 h-4" />
        Tekrar Dene
      </Button>
    </div>
  )
}
