// App.jsx hosts the root application shell shown on the home route.
function App() {
  const today = new Intl.DateTimeFormat('sv-SE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Stockholm',
  }).format(new Date())

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
              <tbody></tbody>
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
