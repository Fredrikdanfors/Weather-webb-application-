// Vitest config ties into Vite so tests share the same module resolution and plugins.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Reuse the React plugin so JSX and Fast Refresh behave the same in tests and dev.
  plugins: [react()],
  test: {
    // jsdom simulates the browser so Testing Library can query the DOM tree.
    environment: 'jsdom',
    // Pull in shared matcher extensions (e.g., toBeInTheDocument) before each suite runs.
    setupFiles: ['./tests/setupTests.js'],
    // Enable globals like describe/it/expect to keep spec files concise.
    globals: true,
  },
})
