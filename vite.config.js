// Vite configuration enabling React-specific tooling.
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Export the config so the Vite CLI can consume it.
export default defineConfig({
  // Activate the official React plugin for JSX and fast refresh support.
  plugins: [react()],
  base: '/Weather-webb-application-/',
})
