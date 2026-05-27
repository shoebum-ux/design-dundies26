import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves a project site from /<repo>/, so the production build needs
// that base path. Dev server stays at '/' so local preview works normally.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/design-dundies26/' : '/',
  plugins: [react()],
}))
