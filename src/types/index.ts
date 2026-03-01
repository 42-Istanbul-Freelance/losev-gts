import type { Role, ActivityType, ActivityStatus, BadgeLevel } from "@/lib/constants"

export interface SessionUser {
  id: string
  email: string
  fullName: string
  role: Role
  schoolId?: string
  schoolName?: string
}

export interface UserWithSchool {
  id: string
  email: string
  fullName: string
  role: Role
  phone?: string | null
  tcNo?: string | null
  grade?: string | null
  coordinatorName?: string | null
  city?: string | null
  district?: string | null
  schoolId?: string | null
  school?: {
    id: string
    name: string
    city: string
    district: string
  } | null
  createdAt: Date
  updatedAt: Date
}

export interface ActivityWithDetails {
  id: string
  date: Date
  type: string
  hours: number
  description: string
  attachmentUrl?: string | null
  status: string
  createdAt: Date
  updatedAt: Date
  studentId: string
  student: {
    id: string
    fullName: string
    grade?: string | null
    school?: {
      name: string
    } | null
  }
  review?: {
    id: string
    decision: string
    note?: string | null
    reviewedAt: Date
    reviewer: {
      fullName: string
    }
  } | null
}

export interface StudentStats {
  thisMonth: number
  thisYear: number
  total: number
  badge: {
    level: BadgeLevel
    label: string
    color: string
    icon: string
  }
}

export interface SchoolStats {
  totalHours: number
  activeStudents: number
  thisMonthHours: number
  topStudents: Array<{
    id: string
    fullName: string
    totalHours: number
    grade?: string | null
  }>
}

export interface HQOverview {
  totalHours: number
  totalStudents: number
  totalSchools: number
  pendingCount: number
  byType: Array<{
    name: string
    value: number
    color: string
  }>
  byMonth: Array<{
    month: string
    hours: number
  }>
}

export interface CityStats {
  city: string
  totalHours: number
  studentCount: number
  schoolCount: number
  averageHours: number
}
