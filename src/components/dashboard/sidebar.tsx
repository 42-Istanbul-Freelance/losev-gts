"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Award,
  CheckSquare,
  Users,
  BarChart3,
  Building2,
  Trophy,
  PieChart,
} from "lucide-react"

type Role = "STUDENT" | "TEACHER" | "HQ"

interface SidebarProps {
  userRole: string
}

const getNavigationUrl = (path: string) => `/dashboard${path === "/" ? "" : path}`

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname()
  const role = userRole as Role

  const links = {
    STUDENT: [
      { name: "Özet", href: "/", icon: LayoutDashboard },
      { name: "Faaliyet Ekle", href: "/activity/new", icon: PlusCircle },
      { name: "Faaliyetlerim", href: "/activity/history", icon: History },
      { name: "Rozetlerim", href: "/badges", icon: Award },
    ],
    TEACHER: [
      { name: "Özet", href: "/", icon: LayoutDashboard },
      { name: "Bekleyen Onaylar", href: "/approvals", icon: CheckSquare },
      { name: "Öğrenciler", href: "/students", icon: Users },
      { name: "Okul İstatistikleri", href: "/stats", icon: BarChart3 },
    ],
    HQ: [
      { name: "Genel Özet", href: "/", icon: LayoutDashboard },
      { name: "Okullar", href: "/schools", icon: Building2 },
      { name: "Liderlik Tablosu", href: "/leaderboard", icon: Trophy },
      { name: "İstatistikler", href: "/analytics", icon: PieChart },
    ],
  }

  const roleLinks = links[role] || []

  return (
    <div className="hidden border-r border-gray-200 bg-white md:flex w-64 flex-col gap-4">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-gray-100">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl text-orange-600">
          <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-sm">
            LÖ
          </div>
          <span className="truncate">Gönüllü Takip</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-y-auto px-4 py-4">
        <ul className="flex flex-col gap-1.5">
          {roleLinks.map((item) => {
            const href = getNavigationUrl(item.href)
            const isActive = pathname === href || (item.href !== "/" && pathname?.startsWith(href))

            const Icon = item.icon
            return (
              <li key={item.name}>
                <Link
                  href={href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-orange-50 text-orange-700 hover:bg-orange-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("h-5 w-5", isActive ? "text-orange-600" : "text-gray-400")} />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div className="mt-auto border-t p-4 text-xs text-center text-gray-500">
        LÖSEV &copy; 2026
      </div>
    </div>
  )
}
