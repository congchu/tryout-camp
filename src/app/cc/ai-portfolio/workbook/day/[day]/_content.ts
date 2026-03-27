import { day1 } from "./_content/day1"
import { day2 } from "./_content/day2"
import { day3 } from "./_content/day3"
import { day4 } from "./_content/day4"
import { day5 } from "./_content/day5"
import type { DayContent } from './_content/types'

export type { DayContent, Step, MissionField } from './_content/types'

export const DAY_CONTENT: Record<number, DayContent> = {
  1: day1, 2: day2, 3: day3, 4: day4, 5: day5
}