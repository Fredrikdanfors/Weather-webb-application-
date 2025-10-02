// App.jsx hosts the root application shell shown on the home route.

const STOCKHOLM_TIMEZONE = 'Europe/Stockholm'

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

function App() {
  const now = new Date()
  const today = formatHeadingDate(now)
  const hourlyRows = generateTodayHoursLocal(now).map((instant) => ({
    id: instant.toISOString(),
    time: formatHour(instant),
  }))

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 py-12">
      <div className="mx-auto max-w-4xl p-6">
        {/* This placeholder copy confirms the scaffold renders before real UI arrives. */}
        <section className="rounded-xl bg-slate-800 p-8 text-center text-slate-100 shadow-lg">
          <h1 className="text-3xl font-semibold">Stockholm Weather</h1>
          <h2 className="mt-2 text-lg font-medium capitalize">{today}</h2>
          <p className="mt-3 text-base text-slate-300">
            Grunden är klar. Nästa steg är att bygga vädertavlan för dagens timmar.
          </p>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[640px] divide-y divide-slate-700 text-left text-sm">
              <caption className="sr-only">Prognos för Stockholms timvisa väderuppdateringar</caption>
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
                {hourlyRows.map((row) => (
                  <tr key={row.id} className="text-slate-200">
                    <th scope="row" className="py-3 font-medium text-slate-100">
                      {row.time}
                    </th>
                    <td className="py-3 text-slate-300">
                      <span aria-hidden="true" className="mr-2 inline-block h-2 w-2 rounded-full bg-slate-500" />
                      <span>—</span>
                    </td>
                    <td className="py-3 text-slate-300">—</td>
                    <td className="py-3 text-slate-300">—</td>
                    <td className="py-3 text-slate-300">—</td>
                    <td className="py-3 text-slate-300">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <footer className="mt-10 text-sm text-slate-500">
        Data från SMHI
      </footer>
    </main>
  )
}

export default App
