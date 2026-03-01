import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { authConfig } from "./auth.config"
import { loginSchema } from "@/lib/validations/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = loginSchema.safeParse(credentials)
        if (!validatedFields.success) return null

        const { email, password, role } = validatedFields.data

        const user = await prisma.user.findUnique({
          where: { email },
          include: { school: true }
        })

        if (!user || user.role !== role) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            schoolId: user.schoolId,
            schoolName: user.school?.name,
          }
        }

        return null
      }
    })
  ],
})
