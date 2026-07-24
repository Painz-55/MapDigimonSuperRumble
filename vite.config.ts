import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const repoBase = env.VITE_BASE_PATH || env.GITHUB_REPOSITORY?.split('/')[1]
  const base = repoBase ? `/${repoBase.replace(/^\/|\/$/g, '')}/` : '/'

  return {
    base,
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './tests/setup.ts',
    },
  }
})
