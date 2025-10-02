import { describe, expect, it } from 'vitest'
import {
  formatHeadingDate,
  formatHour,
  generateTodayHoursLocal,
} from '../src/App.jsx'

describe('Stockholm time helpers', () => {
  it('formatHeadingDate contains Swedish month for a fixed date', () => {
    const date = new Date(Date.UTC(2024, 5, 1, 0, 0, 0))
    const formatted = formatHeadingDate(date)
    expect(formatted.toLowerCase()).toContain('juni')
  })

  it('formatHour yields HH:mm between 00 and 23', () => {
    const date = new Date(Date.UTC(2024, 0, 1, 15, 30))
    const formatted = formatHour(date)
    expect(formatted).toMatch(/^\d{2}:\d{2}$/)
    const [hours] = formatted.split(':')
    const hourNumber = Number(hours)
    expect(Number.isNaN(hourNumber)).toBe(false)
    expect(hourNumber).toBeGreaterThanOrEqual(0)
    expect(hourNumber).toBeLessThanOrEqual(23)
  })

  it('generateTodayHoursLocal returns 24 entries from 00:00 to 23:00', () => {
    const base = new Date(Date.UTC(2024, 0, 15, 12, 0, 0))
    const hours = generateTodayHoursLocal(base)
    expect(hours).toHaveLength(24)

    const hourStrings = hours.map((hour) => formatHour(hour))
    expect(hourStrings[0]).toBe('00:00')
    expect(hourStrings.at(-1)).toBe('23:00')
  })
})
