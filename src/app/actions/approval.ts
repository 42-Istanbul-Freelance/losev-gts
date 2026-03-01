"use server"

import { z } from "zod"
import { approvalSchema } from "@/lib/validations/approval"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"

export async function reviewActivity(values: z.infer<typeof approvalSchema>) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== "TEACHER") {
      return { error: "Bu işlem için yetkiniz bulunmuyor." }
    }

    const validatedFields = approvalSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: "Geçersiz işlem verisi." }
    }

    const { activityId, decision, note } = validatedFields.data

    // Check if activity exists and belongs to the teacher's school
    const activity = await prisma.activity.findUnique({
      where: { id: activityId },
      include: {
        student: {
          select: { schoolId: true }
        }
      }
    })

    if (!activity) {
      return { error: "Faaliyet bulunamadı." }
    }

    if (activity.student.schoolId !== session.user.schoolId) {
      return { error: "Yalnızca kendi okulunuzdaki öğrencilerin faaliyetlerini değerlendirebilirsiniz." }
    }

    if (activity.status !== "PENDING") {
      return { error: "Bu faaliyet zaten değerlendirilmiş." }
    }

    // Run in a transaction to ensure both activity status and review exist
    await prisma.$transaction([
      prisma.activity.update({
        where: { id: activityId },
        data: { status: decision },
      }),
      prisma.activityReview.create({
        data: {
          decision,
          note: note || null,
          activityId,
          reviewerId: session.user.id,
        },
      }),
    ])

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/approvals")
    revalidatePath("/dashboard/students")

    return { success: `Faaliyet başarıyla ${decision === "APPROVED" ? "onaylandı" : "reddedildi"}.` }
  } catch (error) {
    console.error("Faaliyet inceleme hatası:", error)
    return { error: "İşlem sırasında bir hata oluştu." }
  }
}
