import { describe, expect, it } from 'vitest'
import { generateTodayHoursLocal, transformSmhiToRows } from '../src/App.jsx'
import fixture from './fixtures/smhi-point.json'

describe('transformSmhiToRows', () => {
  const helpers = {
    formatHour: (date) =>
      new Intl.DateTimeFormat('sv-SE', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        hourCycle: 'h23',
        timeZone: 'Europe/Stockholm',
      }).format(date),
    getSymbolInfo: (code) => ({ label: `code-${code ?? 'none'}`, icon: '/icons/mock.svg' }),
  }

  it('returns 24 rows and aligns data for known hours', () => {
    const base = new Date('2024-10-01T12:00:00+02:00')
    const hours = generateTodayHoursLocal(base)

    const rows = transformSmhiToRows(fixture, hours, helpers)

    expect(rows).toHaveLength(24)

    const noonRow = rows.find((row) => row.time === '12:00')
    expect(noonRow).toBeTruthy()
    expect(noonRow.temperature).toBe(9.4)
    expect(noonRow.precipitation).toBe(42)
    expect(noonRow.wind).toBe(4.6)
    expect(noonRow.humidity).toBe(68)
    expect(noonRow.weather.label).toBe('code-3')
    expect(noonRow.weather.icon).toBe('/icons/mock.svg')
  })

  it('fills missing hours with placeholder values', () => {
    const base = new Date('2024-10-01T12:00:00+02:00')
    const hours = generateTodayHoursLocal(base)

    const rows = transformSmhiToRows({ ...fixture, timeSeries: fixture.timeSeries.slice(0, 1) }, hours, helpers)

    const missingRow = rows.find((row) => row.time === '15:00')
    expect(missingRow.temperature).toBe('—')
    expect(missingRow.precipitation).toBe('—')
    expect(missingRow.wind).toBe('—')
    expect(missingRow.humidity).toBe('—')
    expect(missingRow.weather.label).toBe('code-none')
  })
})
