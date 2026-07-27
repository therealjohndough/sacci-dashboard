import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed at the root of its own subdomain (dashboard.sacci.space),
// so base is '/'. No change needed for Cloudflare Pages.
export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
})
