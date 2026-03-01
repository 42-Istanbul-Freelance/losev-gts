import { z } from "zod"

export const approvalSchema = z.object({
  activityId: z.string().min(1, "Faaliyet ID gereklidir"),
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().max(500, "Not en fazla 500 karakter olmalıdır").optional().or(z.literal("")),
})

export type ApprovalInput = z.infer<typeof approvalSchema>
