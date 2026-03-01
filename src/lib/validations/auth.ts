import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  password: z.string().min(1, "Şifre gereklidir"),
  role: z.enum(["STUDENT", "TEACHER", "HQ"]),
})

export type LoginInput = z.infer<typeof loginSchema>

export const studentRegisterSchema = z
  .object({
    fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır").max(100, "Ad soyad en fazla 100 karakter olmalıdır"),
    tcNo: z.string().regex(/^\d{11}$/, "T.C. Kimlik No 11 haneli olmalıdır").optional().or(z.literal("")),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır").regex(/[A-Z]/, "En az 1 büyük harf içermelidir").regex(/[0-9]/, "En az 1 rakam içermelidir"),
    confirmPassword: z.string(),
    schoolId: z.string().min(1, "Okul seçimi gereklidir"),
    city: z.string().min(1, "İl seçimi gereklidir"),
    district: z.string().min(1, "İlçe gereklidir"),
    grade: z.string().min(1, "Sınıf seçimi gereklidir"),
    coordinatorName: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  })

export type StudentRegisterInput = z.infer<typeof studentRegisterSchema>

export const teacherRegisterSchema = z
  .object({
    fullName: z.string().min(3, "Ad soyad en az 3 karakter olmalıdır").max(100, "Ad soyad en fazla 100 karakter olmalıdır"),
    email: z.string().email("Geçerli bir e-posta adresi giriniz"),
    password: z.string().min(8, "Şifre en az 8 karakter olmalıdır").regex(/[A-Z]/, "En az 1 büyük harf içermelidir").regex(/[0-9]/, "En az 1 rakam içermelidir"),
    confirmPassword: z.string(),
    phone: z.string().optional().or(z.literal("")),
    schoolId: z.string().min(1, "Okul seçimi gereklidir"),
    city: z.string().min(1, "İl seçimi gereklidir"),
    district: z.string().min(1, "İlçe gereklidir"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  })

export type TeacherRegisterInput = z.infer<typeof teacherRegisterSchema>
