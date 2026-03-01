import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const pathname = nextUrl.pathname
      const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register")
      const isPublicRoute = pathname === "/" || isAuthRoute || pathname.startsWith("/api/auth")
      
      if (isAuthRoute) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl))
        }
        return true
      }

      if (!isLoggedIn && !isPublicRoute) {
        return Response.redirect(new URL("/login", nextUrl))
      }

      return true
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.schoolId = user.schoolId
        token.schoolName = user.schoolName
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.schoolId = token.schoolId as string | undefined
        session.user.schoolName = token.schoolName as string | undefined
      }
      return session
    }
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig
