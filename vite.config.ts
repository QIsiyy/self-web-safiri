import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

const root = path.resolve(__dirname)

export default defineConfig({
  plugins: [
    vue(),
    electron([
      {
        entry: path.join(root, 'src/main/index.ts'),
        onstart({ startup }) {
          startup()
        },
        vite: {
          build: {
            outDir: path.join(root, 'dist/main'),
            rollupOptions: {
              external: ['electron', 'better-sqlite3']
            }
          }
        }
      },
      {
        entry: path.join(root, 'src/preload/index.ts'),
        onstart({ reload }) {
          reload()
        },
        vite: {
          build: {
            outDir: path.join(root, 'dist/preload')
          }
        }
      }
    ]),
    renderer()
  ],
  resolve: {
    alias: {
      '@': path.resolve(root, 'src'),
      '@main': path.resolve(root, 'src/main'),
      '@renderer': path.resolve(root, 'src/renderer'),
      '@preload': path.resolve(root, 'src/preload'),
      '@shared': path.resolve(root, 'src/shared')
    }
  },
  root: path.join(root, 'src/renderer'),
  build: {
    outDir: path.join(root, 'dist/renderer'),
    emptyOutDir: true
  },
  server: {
    port: 3000
  }
})
