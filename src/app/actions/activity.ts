"use server"

import { z } from "zod"
import { activitySchema } from "@/lib/validations/activity"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { ActivityType } from "@/lib/constants"

export async function createActivity(values: z.infer<typeof activitySchema>) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "STUDENT") {
      return { error: "Bu işlem için öğrenci girişi yapmalısınız." }
    }

    const validatedFields = activitySchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: "Girdiğiniz verilerde 1 veya daha fazla hata var." }
    }

    const { date, type, hours, description, attachmentUrl } = validatedFields.data

    await prisma.activity.create({
      data: {
        date: new Date(date),
        type,
        hours,
        description,
        attachmentUrl: attachmentUrl || null,
        status: "PENDING",
        studentId: session.user.id,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/activity/history")

    return { success: "Faaliyet başarıyla kaydedildi! Sorumlu öğretmeninizin onayına sunuldu." }
  } catch (error) {
    console.error("Faaliyet ekleme hatası:", error)
    return { error: "Faaliyet eklenirken sistemsel bir hata oluştu." }
  }
}
