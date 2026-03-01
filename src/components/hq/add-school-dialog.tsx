"use client"

import { useRef } from "react"
import { useFormState, useFormStatus } from "react-dom"
import { createSchool } from "@/app/actions/hq"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, PlusCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CITIES } from "@/lib/constants"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      className="w-full bg-blue-600 hover:bg-blue-700"
    >
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Ekleniyor...
        </>
      ) : (
        "Okulu Kaydet"
      )}
    </Button>
  )
}

export function AddSchoolDialog() {
  const [state, formAction] = useFormState(createSchool, null)
  const formRef = useRef<HTMLFormElement>(null)

  // Başarılı olduğunda formu temizle
  if (state?.success && formRef.current) {
    formRef.current.reset()
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 gap-2">
          <PlusCircle className="w-4 h-4" />
          Yeni Okul Ekle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            Yeni Okul Ekle (LİSE)
          </DialogTitle>
          <DialogDescription>
            Sisteme yeni bir LÖSEV kulüplü lise kaydetmek için bilgileri doldurun.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Okulun Tam Adı</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Örn: Ankara Fen Lisesi" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Bulunduğu İl</Label>
              <select
                id="city"
                name="city"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
                defaultValue=""
              >
                <option value="" disabled>İl Seçiniz</option>
                {CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">İlçe</Label>
              <Input 
                id="district" 
                name="district" 
                placeholder="Örn: Çankaya" 
                required 
              />
            </div>
          </div>

          {state?.error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}

          {state?.success && (
            <Alert className="mt-4 border-green-200 bg-green-50 text-green-800">
              <AlertDescription>{state.success}</AlertDescription>
            </Alert>
          )}

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
