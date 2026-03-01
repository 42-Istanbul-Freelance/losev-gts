"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { loginSchema } from "@/lib/validations/auth"
import { login } from "@/app/actions/auth"
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
import { AlertCircle, Loader2 } from "lucide-react"

export function LoginForm() {
  const [error, setError] = useState<string | undefined>("")
  const [isPending, setIsPending] = useState(false)

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "STUDENT",
    },
  })

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setError("")
    setIsPending(true)

    try {
      const response = await login(values)
      if (response?.error) {
        setError(response.error)
      }
    } catch (err) {
      setError("Beklenmeyen bir hata oluştu.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-orange-100">
      <CardHeader className="space-y-1 text-center bg-orange-50/50 rounded-t-xl pb-6 border-b border-orange-100/50">
        <div className="mx-auto w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mb-4 shadow-md">
          <span className="text-white font-bold text-2xl">LÖ</span>
        </div>
        <CardTitle className="text-2xl font-bold text-gray-800">Sisteme Giriş Yap</CardTitle>
        <CardDescription className="text-gray-500">
          Gönüllülük Takip Sistemi'ne hoş geldiniz
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Giriş Rolü</FormLabel>
                  <Select disabled={isPending} onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-gray-200 focus:ring-orange-500">
                        <SelectValue placeholder="Rolünüzü seçin" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STUDENT">Öğrenci</SelectItem>
                      <SelectItem value="TEACHER">Öğretmen</SelectItem>
                      <SelectItem value="HQ">Genel Merkez</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">E-posta</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="ornek@losev.org.tr" 
                      type="email" 
                      disabled={isPending}
                      className="border-gray-200 focus-visible:ring-orange-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 font-semibold">Şifre</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="******" 
                      type="password" 
                      disabled={isPending}
                      className="border-gray-200 focus-visible:ring-orange-500" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md flex items-center gap-2 text-sm">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 shadow-md transition-all hover:shadow-lg"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Giriş yapılıyor...
                </>
              ) : (
                "Giriş Yap"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4 pt-0 text-center">
        <div className="relative w-full">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Hesabınız yok mu?</span>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <Button variant="outline" className="flex-1 border-orange-200 text-orange-700 hover:bg-orange-50" asChild>
            <Link href="/register/student">Öğrenci Kayıt</Link>
          </Button>
          <Button variant="outline" className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50" asChild>
            <Link href="/register/teacher">Öğretmen Kayıt</Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
