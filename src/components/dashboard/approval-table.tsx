"use client"

import { useState } from "react"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ACTIVITY_TYPES } from "@/lib/constants"
import { reviewActivity } from "@/app/actions/approval"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ExternalLink, CheckCircle, XCircle, Loader2 } from "lucide-react"

type PendingActivity = {
  id: string
  date: Date
  type: string
  hours: number
  description: string
  attachmentUrl?: string | null
  student: {
    fullName: string
    grade?: string | null
  }
}

interface ApprovalTableProps {
  activities: PendingActivity[]
}

export function ApprovalTable({ activities }: ApprovalTableProps) {
  const [selectedActivity, setSelectedActivity] = useState<PendingActivity | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [note, setNote] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  const handleReview = async (decision: "APPROVED" | "REJECTED") => {
    if (!selectedActivity) return

    setIsPending(true)
    setError("")

    try {
      const result = await reviewActivity({
        activityId: selectedActivity.id,
        decision,
        note,
      })

      if (result.error) {
        setError(result.error)
      } else {
        setIsDialogOpen(false)
        setSelectedActivity(null)
        setNote("")
      }
    } catch (err) {
      setError("Bir hata oluştu.")
    } finally {
      setIsPending(false)
    }
  }

  const openDialog = (activity: PendingActivity) => {
    setSelectedActivity(activity)
    setNote("")
    setError("")
    setIsDialogOpen(true)
  }

  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-white shadow-sm border-gray-100">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-500">
          <CheckCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Bekleyen faaliyet yok</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Harika! Tüm öğrenci faaliyetlerini incelediniz. Şu an onay bekleyen yeni bir kayıt bulunmuyor.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden border-gray-100">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/80">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-gray-700">Öğrenci</TableHead>
                <TableHead className="font-semibold text-gray-700">Tarih</TableHead>
                <TableHead className="font-semibold text-gray-700">Faaliyet Türü</TableHead>
                <TableHead className="font-semibold text-gray-700">Süre</TableHead>
                <TableHead className="font-semibold text-gray-700 max-w-[200px]">Açıklama</TableHead>
                <TableHead className="font-semibold text-gray-700 text-right">İşlem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity) => {
                const typeLabel = ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES] || "Bilinmeyen"

                return (
                  <TableRow key={activity.id} className="group hover:bg-gray-50/50">
                    <TableCell className="font-medium whitespace-nowrap">
                      {activity.student.fullName}
                      <span className="block text-xs text-gray-500 font-normal">{activity.student.grade}</span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(activity.date), "dd MMM yyyy", { locale: tr })}
                    </TableCell>
                    <TableCell>
                      {typeLabel}
                    </TableCell>
                    <TableCell className="whitespace-nowrap font-medium">
                      {activity.hours} saat
                    </TableCell>
                    <TableCell className="max-w-[250px] truncate text-gray-600" title={activity.description}>
                      {activity.description}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => openDialog(activity)}
                      >
                        İncele
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Faaliyet Değerlendirmesi</DialogTitle>
            <DialogDescription>
              {selectedActivity?.student.fullName} adlı öğrencinin faaliyet bilgilerini inceliyorsunuz.
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold text-gray-700 block">Tür:</span>
                  <span className="text-gray-600">{ACTIVITY_TYPES[selectedActivity.type as keyof typeof ACTIVITY_TYPES]}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Süre:</span>
                  <span className="text-gray-600">{selectedActivity.hours} saat</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Tarih:</span>
                  <span className="text-gray-600">{format(new Date(selectedActivity.date), "dd MMMM yyyy", { locale: tr })}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 block">Kanıt/Belge:</span>
                  {selectedActivity.attachmentUrl ? (
                    <a 
                      href={selectedActivity.attachmentUrl} 
                      target="_blank" 
                      rel="noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline"
                    >
                      Banka Bağlantısı <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-gray-400 italic">Eklenmemiş</span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700 block mb-1 text-sm">Açıklama:</span>
                <p className="text-sm bg-gray-50 p-3 rounded-md text-gray-700 border border-gray-100">
                  {selectedActivity.description}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="note">Değerlendirme Notu (İsteğe Bağlı)</Label>
                <Textarea 
                  id="note" 
                  placeholder="Öğrenciye iletmek istediğiniz bir mesaj varsa yazabilirsiniz..."
                  className="resize-none"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  disabled={isPending}
                />
                {error && <p className="text-sm text-red-500 font-medium mt-1">{error}</p>}
              </div>
            </div>
          )}
          
          <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={() => handleReview("REJECTED")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
              Reddet
            </Button>
            <Button 
              type="button" 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleReview("APPROVED")}
              disabled={isPending}
            >
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
              Onayla
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
