"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ACTIVITY_TYPES, STATUS_COLORS, STATUS_LABELS } from "@/lib/constants"
import type { ActivityWithDetails } from "@/types"
import { format } from "date-fns"
import { tr } from "date-fns/locale"
import { ExternalLink, Info } from "lucide-react"

interface ActivityHistoryTableProps {
  activities: ActivityWithDetails[]
}

export function ActivityHistoryTable({ activities }: ActivityHistoryTableProps) {
  if (activities.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-xl bg-white shadow-sm border-gray-100">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
          <Info className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-medium text-gray-900">Henüz faaliyet bulunmuyor</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Şu ana kadar eklenmiş bir gönüllülük faaliyetiniz yok. Yeni bir faaliyet ekleyerek başlayabilirsiniz.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden border-gray-100">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50/80">
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-semibold text-gray-700">Tarih</TableHead>
              <TableHead className="font-semibold text-gray-700">Faaliyet Türü</TableHead>
              <TableHead className="font-semibold text-gray-700">Süre</TableHead>
              <TableHead className="font-semibold text-gray-700 hidden md:table-cell">Açıklama</TableHead>
              <TableHead className="font-semibold text-gray-700">Kanıt</TableHead>
              <TableHead className="font-semibold text-gray-700">Durum</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity) => {
              const typeLabel = ACTIVITY_TYPES[activity.type as keyof typeof ACTIVITY_TYPES] || "Bilinmeyen"
              const statusLabel = STATUS_LABELS[activity.status as keyof typeof STATUS_LABELS] || activity.status
              const statusColors = STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-800"

              return (
                <TableRow key={activity.id} className="group hover:bg-gray-50/50">
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(activity.date), "dd MMM yyyy", { locale: tr })}
                  </TableCell>
                  <TableCell>
                    {typeLabel}
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-medium">
                    {activity.hours} saat
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-[250px] truncate text-gray-600" title={activity.description}>
                    {activity.description}
                  </TableCell>
                  <TableCell>
                    {activity.attachmentUrl ? (
                      <a 
                        href={activity.attachmentUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="inline-flex items-center text-orange-600 hover:text-orange-700 text-sm font-medium hover:underline"
                      >
                        Bağlantı
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-gray-400 text-sm italic">Yok</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${statusColors} border-transparent shadow-none font-medium`}>
                      {statusLabel}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
