"use server"

import { z } from "zod"
import { loginSchema, studentRegisterSchema, teacherRegisterSchema } from "@/lib/validations/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { signIn } from "@/auth"
import { AuthError } from "next-auth"

export async function login(values: z.infer<typeof loginSchema>) {
  try {
    const validatedFields = loginSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: "Geçersiz veriler." }
    }

    const { email, password, role } = validatedFields.data

    await signIn("credentials", {
      email,
      password,
      role,
      redirectTo: "/dashboard",
    })
    
    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "E-posta, şifre veya seçilen rol hatalı." }
        default:
          return { error: "Giriş yapılırken bir hata oluştu." }
      }
    }
    
    // next/navigation redirect throws an error, so we must rethrow
    throw error
  }
}

export async function registerStudent(values: z.infer<typeof studentRegisterSchema>) {
  try {
    const validatedFields = studentRegisterSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: "Geçersiz veriler." }
    }

    const { email, password, fullName, schoolId, tcNo, grade, coordinatorName, city, district } = validatedFields.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Bu e-posta adresi zaten kullanımda." }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "STUDENT",
        schoolId,
        tcNo,
        grade,
        coordinatorName,
        city,
        district,
      },
    })

    return { success: "Öğrenci hesabı başarıyla oluşturuldu! Lütfen giriş yapın." }
  } catch (error) {
    console.error("Öğrenci kayıt hatası:", error)
    return { error: "Bir hata oluştu, lütfen tekrar deneyin." }
  }
}

export async function registerTeacher(values: z.infer<typeof teacherRegisterSchema>) {
  try {
    const validatedFields = teacherRegisterSchema.safeParse(values)

    if (!validatedFields.success) {
      return { error: "Geçersiz veriler." }
    }

    const { email, password, fullName, phone, schoolId, city, district } = validatedFields.data

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Bu e-posta adresi zaten kullanımda." }
    }

    const passwordHash = await bcrypt.hash(password, 12)

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "TEACHER",
        phone,
        schoolId,
        city,
        district,
      },
    })

    return { success: "Öğretmen hesabı başarıyla oluşturuldu! Lütfen giriş yapın." }
  } catch (error) {
    console.error("Öğretmen kayıt hatası:", error)
    return { error: "Bir hata oluştu, lütfen tekrar deneyin." }
  }
}
