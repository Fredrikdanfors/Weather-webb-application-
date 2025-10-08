// App.jsx hosts the root application shell shown on the home route.
import { useEffect, useMemo, useState } from 'react'

const STOCKHOLM_TIMEZONE = 'Europe/Stockholm'

const WEATHER_SYMBOLS = {
  1: {
    label: 'Klart',
    icon: '/src/assets/icons/clear.svg',
  },
  2: {
    label: 'Lätt molnigt',
    icon: '/src/assets/icons/partly-cloudy.svg',
  },
  3: {
    label: 'Molnigt',
    icon: '/src/assets/icons/cloudy.svg',
  },
  4: {
    label: 'Mulet',
    icon: '/src/assets/icons/overcast.svg',
  },
  5: {
    label: 'Dimmigt',
    icon: '/src/assets/icons/fog.svg',
  },
  6: {
    label: 'Lätt regn',
    icon: '/src/assets/icons/light-rain.svg',
  },
  7: {
    label: 'Regn',
    icon: '/src/assets/icons/rain.svg',
  },
}

const UNKNOWN_SYMBOL = {
  label: 'Okänt',
  icon: '/src/assets/icons/unknown.svg',
}

export function formatHeadingDate(date) {
  const target = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(target.getTime())) {
    throw new TypeError('formatHeadingDate requires a valid Date instance or value')
  }

  return new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: STOCKHOLM_TIMEZONE,
  }).format(target)
}

export function formatHour(date) {
  const target = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(target.getTime())) {
    throw new TypeError('formatHour requires a valid Date instance or value')
  }

  return new Intl.DateTimeFormat('sv-SE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    hourCycle: 'h23',
    timeZone: STOCKHOLM_TIMEZONE,
  }).format(target)
}

function parseStockholmOffsetMinutes(instant) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: STOCKHOLM_TIMEZONE,
    timeZoneName: 'shortOffset',
  }).formatToParts(instant)

  const offsetToken = parts.find((part) => part.type === 'timeZoneName')?.value
  const match = offsetToken?.match(/GMT([+-])(\d{1,2})(?::(\d{2}))?/)
  if (!match) {
    throw new Error('Unable to determine Stockholm offset from Intl API response')
  }

  const sign = match[1] === '-' ? -1 : 1
  const hours = Number(match[2])
  const minutes = match[3] ? Number(match[3]) : 0

  return sign * (hours * 60 + minutes)
}

export function generateTodayHoursLocal(now = new Date()) {
  const base = now instanceof Date ? now : new Date(now)
  if (Number.isNaN(base.getTime())) {
    throw new TypeError('generateTodayHoursLocal requires a valid Date instance or value')
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: STOCKHOLM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(base)

  const partValue = (type) => {
    const token = parts.find((part) => part.type === type)
    if (!token) {
      throw new Error(`Missing ${type} part when resolving Stockholm calendar day`)
    }
    return Number(token.value)
  }

  const year = partValue('year')
  const month = partValue('month')
  const day = partValue('day')

  const midnightUtcGuess = Date.UTC(year, month - 1, day, 0)
  const midnightOffsetMinutes = parseStockholmOffsetMinutes(new Date(midnightUtcGuess))
  const stockholmMidnightUtc = midnightUtcGuess - midnightOffsetMinutes * 60 * 1000

  return Array.from({ length: 24 }, (_, hour) => {
    const instant = new Date(stockholmMidnightUtc + hour * 60 * 60 * 1000)
    return instant
  })
}

export function transformSmhiToRows(json, todayHoursLocal, helpers = {}) {
  if (!Array.isArray(todayHoursLocal)) {
    throw new TypeError('transformSmhiToRows expected todayHoursLocal to be an array of Date instances')
  }

  const {
    formatHour: formatHourHelper = formatHour,
    getSymbolInfo = (code) => WEATHER_SYMBOLS[code] ?? UNKNOWN_SYMBOL,
  } = helpers

  const daysFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: STOCKHOLM_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const todayKey = todayHoursLocal.length
    ? daysFormatter.format(todayHoursLocal[0])
    : daysFormatter.format(new Date())

  const safeNumber = (value) => (Number.isFinite(value) ? value : null)
  const parametersToMap = (parameters = []) => {
    return parameters.reduce((acc, param) => {
      if (param && typeof param.name === 'string') {
        acc[param.name] = Array.isArray(param.values) ? param.values[0] : undefined
      }
      return acc
    }, {})
  }

  const formatMetric = (value) => {
    const numeric = safeNumber(value)
    return numeric ?? '—'
  }

  const entryMap = new Map()

  for (const item of json?.timeSeries ?? []) {
    const instant = new Date(item?.validTime ?? NaN)
    if (Number.isNaN(instant.getTime())) continue

    if (daysFormatter.format(instant) !== todayKey) continue

    const hourKey = formatHourHelper(instant)
    const map = parametersToMap(item.parameters)

    const precipitation = safeNumber(
      map.pmean ?? map.pmedian ?? map.pmax ?? null,
    )

    entryMap.set(hourKey, {
      temperature: safeNumber(map.t ?? null),
      precipitation,
      wind: safeNumber(map.ws ?? null),
      humidity: safeNumber(map.r ?? null),
      weatherCode: map.Wsymb2 ?? null,
    })
  }

  return todayHoursLocal.map((instant) => {
    const hourKey = formatHourHelper(instant)
    const data = entryMap.get(hourKey)
    const symbol = getSymbolInfo(data?.weatherCode)

    return {
      id: instant.toISOString(),
      time: hourKey,
      weatherCode: data?.weatherCode ?? null,
      weather: {
        label: symbol?.label ?? UNKNOWN_SYMBOL.label,
        icon: symbol?.icon ?? UNKNOWN_SYMBOL.icon,
      },
      temperature: formatMetric(data?.temperature),
      precipitation: formatMetric(data?.precipitation),
      wind: formatMetric(data?.wind),
      humidity: formatMetric(data?.humidity),
    }
  })
}

export async function fetchSmhiForecast({ signal } = {}) {
  const latitude = 59.3293
  const longitude = 18.0686
  const endpoint = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/${longitude}/lat/${latitude}/data.json`

  const response = await fetch(endpoint, {
    headers: {
      Accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error(`SMHI forecast request failed with status ${response.status}`)
  }

  return response.json()
}

function App({ initialNow } = {}) {
  const now = useMemo(() => {
    if (initialNow instanceof Date) {
      return new Date(initialNow.getTime())
    }

    if (initialNow !== undefined) {
      const parsed = new Date(initialNow)
      if (!Number.isNaN(parsed.getTime())) {
        return parsed
      }
    }

    return new Date()
  }, [initialNow])
  const today = formatHeadingDate(now)
  const todayHours = useMemo(() => generateTodayHoursLocal(now), [now])
  const [rows, setRows] = useState(() =>
    todayHours.map((instant) => ({
      id: instant.toISOString(),
      time: formatHour(instant),
      weather: { label: UNKNOWN_SYMBOL.label, icon: UNKNOWN_SYMBOL.icon },
      temperature: '—',
      precipitation: '—',
      wind: '—',
      humidity: '—',
    })),
  )
  const [error, setError] = useState(null)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchSmhiForecast()
      .then((data) => {
        if (cancelled) return
        const nextRows = transformSmhiToRows(data, todayHours, {
          formatHour,
        })
        setRows(nextRows)
        setError(null)
      })
      .catch((error) => {
        if (cancelled) return
        console.error('Failed to fetch SMHI forecast', error)
        setError('Kunde inte hämta prognos.')
      })

    return () => {
      cancelled = true
    }
  }, [todayHours, reloadCount])

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 py-12">
      <div className="mx-auto max-w-4xl p-6">
        {/* This placeholder copy confirms the scaffold renders before real UI arrives. */}
        <section className="rounded-xl bg-slate-800 p-8 text-center text-slate-100 shadow-lg">
          <h1 className="text-3xl font-semibold">Stockholm Weather</h1>
          <h2 className="mt-2 text-lg font-medium capitalize">{today}</h2>
          <p className="mt-3 text-base text-slate-300">
            Den här sidan visar SMHI:s timvisa prognos för Stockholm med svensk
            tid, etiketter och en snabb vy över temperatur, nederbörd, vind och
            luftfuktighet.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] table-fixed border-collapse divide-y divide-slate-700 text-left text-sm">
              <caption className="sr-only">Väder per timme i Stockholm</caption>
              <thead className="text-slate-400">
                <tr>
                  <th scope="col" className="py-3 font-medium uppercase tracking-wide">Tid</th>
                  <th scope="col" className="py-3 font-medium uppercase tracking-wide">Väder</th>
                  <th scope="col" className="py-3 font-medium uppercase tracking-wide">Temp (°C)</th>
                  <th scope="col" className="py-3 font-medium uppercase tracking-wide">Nederbörd (mm)</th>
                  <th scope="col" className="py-3 font-medium uppercase tracking-wide">Vind (m/s)</th>
                  <th scope="col" className="py-3 font-medium uppercase tracking-wide">Luftfuktighet (%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {rows.map((row) => (
                  <tr key={row.id} className="text-slate-200">
                    <th scope="row" className="py-3 font-medium text-slate-100">
                      {row.time}
                    </th>
                    <td className="py-3 text-slate-300">
                      <span className="mr-3 inline-flex items-center gap-2">
                        <img
                          src={row.weather.icon}
                          alt={row.weather.label}
                          className="h-5 w-5 rounded-full bg-slate-700/60 p-1"
                        />
                        <span>{row.weather.label}</span>
                      </span>
                    </td>
                    <td className="py-3 text-right text-slate-300">{row.temperature}</td>
                    <td className="py-3 text-right text-slate-300">{row.precipitation}</td>
                    <td className="py-3 text-right text-slate-300">{row.wind}</td>
                    <td className="py-3 text-right text-slate-300">{row.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {error && (
            <div className="mt-4 flex flex-col items-center gap-3">
              <p className="text-sm font-medium text-rose-300" role="alert">
                {error}
              </p>
              <button
                type="button"
                onClick={() => setReloadCount((count) => count + 1)}
                className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-rose-50 transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300 focus:ring-offset-2 focus:ring-offset-slate-800"
              >
                Försök igen
              </button>
            </div>
          )}
        </section>
      </div>
      <footer className="mt-10 text-sm text-slate-500">
        Data från SMHI
      </footer>
    </main>
  )
}

export default App
