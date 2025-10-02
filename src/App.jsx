// App.jsx hosts the root application shell shown on the home route.
function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-12">
      {/* This placeholder copy confirms the scaffold renders before real UI arrives. */}
      <section className="max-w-2xl rounded-xl bg-slate-800 p-8 text-center text-slate-100 shadow-lg">
        <h1 className="text-3xl font-semibold">Stockholm Weather</h1>
        <p className="mt-3 text-base text-slate-300">
          Grunden är klar. Nästa steg är att bygga vädertavlan för dagens timmar.
        </p>
      </section>
    </main>
  )
}

export default App
