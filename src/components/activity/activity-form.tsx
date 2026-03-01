"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { activitySchema } from "@/lib/validations/activity"
import { createActivity } from "@/app/actions/activity"
import { ACTIVITY_TYPES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2, Clock, CalendarDays, FileText, Send, Loader2 } from "lucide-react"

export function ActivityForm() {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, setIsPending] = useState(false)

  // Default to today for the date field
  const today = new Date().toISOString().split('T')[0]

  const form = useForm<z.infer<typeof activitySchema>>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      date: today,
      type: "OTHER",
      hours: 1,
      description: "",
      attachmentUrl: "",
    },
  })

  async function onSubmit(values: z.infer<typeof activitySchema>) {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const response = await createActivity(values)
      if (response?.error) {
        setError(response.error)
      } else if (response?.success) {
        setSuccess(response.success)
        form.reset({
          date: today,
          type: "OTHER",
          hours: 1,
          description: "",
          attachmentUrl: "",
        })
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-sm border-gray-200">
      <CardHeader className="space-y-1 bg-white border-b border-gray-100 pb-6 rounded-t-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-800">Yeni Faaliyet Ekle</CardTitle>
            <CardDescription className="text-gray-500 text-base">
              Lütfen gerçekleştirdiğiniz gönüllülük faaliyetinin detaylarını girin
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date Field */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      <CalendarDays className="w-4 h-4 text-gray-400" />
                      Faaliyet Tarihi
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        max={today}
                        disabled={isPending} 
                        className="focus-visible:ring-orange-500"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Type Field */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700">
                      Faaliyet Türü
                    </FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="focus:ring-orange-500">
                          <SelectValue placeholder="Faaliyet türü seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(ACTIVITY_TYPES).map(([key, label]) => (
                          <SelectItem key={key} value={key}>{label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Hours Field */}
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Harcanan Süre (Saat)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.5"
                      min="0.5"
                      max="8"
                      disabled={isPending}
                      className="focus-visible:ring-orange-500 w-full md:w-1/2"
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>
                    Yarım saatlik dilimler halinde en fazla 8 saat girebilirsiniz (Örn: 1.5, 2, 4.5).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description Field */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Faaliyet Açıklaması</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Faaliyet sırasında neler yaptığınızı kısaca anlatın..."
                      className="resize-none h-28 focus-visible:ring-orange-500"
                      disabled={isPending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    En az 10, en fazla 500 karakter kullanın.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Attachment URL (Optional) */}
            <FormField
              control={form.control}
              name="attachmentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Kanıt Bağlantısı / URL (Opsiyonel)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://drive.google.com/... (Fotoğraf, belge vs.)" 
                      type="url"
                      disabled={isPending}
                      className="focus-visible:ring-orange-500"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Faaliyetinizi kanıtlayan bir görsel veya belge bağlantısı eklemeniz onay sürecini hızlandırır.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-4 rounded-md flex items-start gap-3 text-sm shadow-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-green-600" />
                <div>
                  <p className="font-medium text-base mb-1">Başarılı!</p>
                  <p>{success}</p>
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-gray-100">
              <Button 
                type="submit" 
                className="w-full md:w-auto md:min-w-40 bg-orange-600 hover:bg-orange-700 text-white font-medium shadow-sm transition-colors float-right"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Onaya Gönder
                  </>
                )}
              </Button>
              <div className="clear-both"></div>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
