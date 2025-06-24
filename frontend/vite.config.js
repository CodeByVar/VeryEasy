// vite.config.ts (o vite.config.js)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // Importa el plugin de Tailwind CSS

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Agrega el plugin de Tailwind CSS aquí
  ],
  //servidor de vite conexion con el backend
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
});