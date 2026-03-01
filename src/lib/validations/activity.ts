import { z } from "zod"

export const activitySchema = z.object({
  date: z.string().refine(
    (val) => {
      const date = new Date(val)
      const today = new Date()
      today.setHours(23, 59, 59, 999)
      return date <= today
    },
    { message: "Gelecek tarih seçilemez" }
  ),
  type: z.enum([
    "SEMINAR",
    "STAND",
    "DONATION",
    "FAIR",
    "SOCIAL_MEDIA",
    "VISIT",
    "EDUCATION",
    "OTHER",
  ]),
  hours: z
    .number()
    .min(0.5, "En az 0.5 saat girilmelidir")
    .max(8, "En fazla 8 saat girilebilir")
    .multipleOf(0.5, "Saat değeri 0.5'in katları olmalıdır"),
  description: z
    .string()
    .min(10, "Açıklama en az 10 karakter olmalıdır")
    .max(500, "Açıklama en fazla 500 karakter olmalıdır"),
  attachmentUrl: z.string().optional().or(z.literal("")),
})

export type ActivityInput = z.infer<typeof activitySchema>
