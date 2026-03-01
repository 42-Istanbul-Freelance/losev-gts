import { BadgeLevel, BADGE_LEVELS } from "@/lib/constants"

export function getBadgeLevel(totalHours: number): BadgeLevel {
  if (totalHours >= 100) return "GOLD"
  if (totalHours >= 50) return "SILVER"
  if (totalHours >= 25) return "BRONZE"
  return "NEW"
}

export function getBadgeInfo(totalHours: number) {
  const level = getBadgeLevel(totalHours)
  return BADGE_LEVELS[level]
}
