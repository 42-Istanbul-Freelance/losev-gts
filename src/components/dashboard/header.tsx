"use client"

import { LogOut, Menu, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"

interface HeaderProps {
  user: {
    name?: string | null
    email?: string | null
    role?: string
    schoolName?: string | null
  }
}

export function Header({ user }: HeaderProps) {
  const roleMap: Record<string, string> = {
    STUDENT: "Öğrenci",
    TEACHER: "Sorumlu Öğretmen",
    HQ: "Genel Merkez",
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-4 md:px-6 shadow-sm z-10">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        <div className="hidden md:flex flex-col">
          <span className="text-sm font-semibold text-gray-800">
            {user.schoolName || "LÖSEV Genel Merkez"}
          </span>
          <span className="text-xs text-gray-500">
            {roleMap[user.role || ""] || user.role} Portalı
          </span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 rounded-full pl-2 pr-4 border border-gray-200">
              <UserCircle className="mr-2 h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium mr-2">{user.name?.split(" ")[0]}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
               className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50"
               onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
