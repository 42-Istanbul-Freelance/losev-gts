"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { studentRegisterSchema } from "@/lib/validations/auth"
import { registerStudent } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"

type School = { id: string; name: string }

export function RegisterStudentForm({ schools }: { schools: School[] }) {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof studentRegisterSchema>>({
    resolver: zodResolver(studentRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullName: "",
      schoolId: "",
      tcNo: "",
      grade: "",
      coordinatorName: "",
      city: "",
      district: "",
    },
  })

  async function onSubmit(values: z.infer<typeof studentRegisterSchema>) {
    setError("")
    setSuccess("")
    setIsPending(true)

    try {
      const response = await registerStudent(values)
      if (response?.error) {
        setError(response.error)
      } else if (response?.success) {
        setSuccess(response.success)
        form.reset()
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-orange-100">
      <CardHeader className="space-y-1 text-center bg-orange-50/50 rounded-t-xl pb-6 border-b border-orange-100/50">
        <CardTitle className="text-2xl font-bold text-gray-800">Öğrenci Kaydı</CardTitle>
        <CardDescription className="text-gray-500">
          LÖSEV Gönüllülük Takip Sistemi'ne hemen katılın
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ad Soyad</FormLabel>
                    <FormControl>
                      <Input placeholder="Ad Soyad" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tcNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TC Kimlik No (İsteğe Bağlı)</FormLabel>
                    <FormControl>
                      <Input placeholder="11 Haneli TC No" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-posta</FormLabel>
                    <FormControl>
                      <Input placeholder="ornek@losev.org.tr" type="email" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre (Tekrar)</FormLabel>
                    <FormControl>
                      <Input placeholder="******" type="password" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İl</FormLabel>
                    <FormControl>
                      <Input placeholder="Ankara" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>İlçe</FormLabel>
                    <FormControl>
                      <Input placeholder="Çankaya" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="schoolId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Okul</FormLabel>
                    <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Okulunuzu seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {schools.map(school => (
                          <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sınıf</FormLabel>
                    <FormControl>
                      <Input placeholder="Örn: 10" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="coordinatorName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Koordinatör Öğretmen Adı</FormLabel>
                    <FormControl>
                      <Input placeholder="Öğretmeninizin adı ve soyadı" disabled={isPending} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                <p>{success}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 shadow-md"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Kayıt Yapılıyor...
                </>
              ) : (
                "Kayıt Ol"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center border-t border-gray-100 pt-6">
        <p className="text-sm text-gray-500">
          Zaten hesabınız var mı?{" "}
          <Link href="/login" className="text-orange-600 hover:underline font-medium">
            Giriş Yapın
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
