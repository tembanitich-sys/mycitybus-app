import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative base so the production build can be hosted from any sub-path
  // (static file server, file://, or an embedded preview) with no server config.
  base: './',
  plugins: [react(), tailwindcss()],
})
