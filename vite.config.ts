import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        // leaflet-draw ships no real ESM/CJS export (just a global-attaching
        // UMD script); react-leaflet-draw imports it only for the side
        // effect, which rolldown's strict export analysis rejects. Route
        // the bare specifier (only) through a local shim, see
        // src/shims/leaflet-draw.ts. Anchored regex so deep imports like
        // "leaflet-draw/dist/leaflet.draw.css" stay untouched.
        find: /^leaflet-draw$/,
        replacement: fileURLToPath(
          new URL('./src/shims/leaflet-draw.ts', import.meta.url),
        ),
      },
    ],
  },
})
