import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sites } from '@openai/sites-vite-plugin'
// The helper is JavaScript so this compact Vite project does not need Node type packages.
// @ts-ignore Local build helper without a declaration file.
import { originalVideoDevServer } from './scripts/original-video-dev-server.mjs'

export default defineConfig({
  plugins: [react(), originalVideoDevServer(), sites()],
})
