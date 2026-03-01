"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schoolSchema = z.object({
  name: z.string().min(5, "Okul adı en az 5 karakter olmalıdır"),
  city: z.string().min(2, "Şehir adı en az 2 karakter olmalıdır"),
  district: z.string().min(2, "İlçe adı en az 2 karakter olmalıdır"),
})

export async function createSchool(prevState: any, formData: FormData) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "HQ") {
      return { error: "Bu işlem için yetkiniz yok." }
    }

    const validatedFields = schoolSchema.safeParse({
      name: formData.get("name"),
      city: formData.get("city"),
      district: formData.get("district"),
    })

    if (!validatedFields.success) {
      return { error: "Lütfen tüm alanları geçerli formatta doldurun." }
    }

    const { name, city, district } = validatedFields.data

    // Okul adının benzersiz olduğunu kontrol et
    const existingSchool = await prisma.school.findFirst({
      where: {
        name: {
          equals: name,
        }
      }
    })

    if (existingSchool) {
      return { error: "Bu isimde bir okul sistemde zaten kayıtlı." }
    }

    await prisma.school.create({
      data: {
        name,
        city,
        district,
      }
    })

    revalidatePath("/dashboard/schools")
    revalidatePath("/register/student")
    revalidatePath("/register/teacher")

    return { success: "Okul başarıyla sisteme eklendi." }
  } catch (error) {
    console.error("Okul ekleme hatası:", error)
    return { error: "Okul eklenirken bir sunucu hatası oluştu." }
  }
}
