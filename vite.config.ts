import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Esta configuração resolve o erro de Build na Vercel.
// Ela avisa ao Vite que o React e o Supabase são carregados via CDN (no index.html)
// e não devem ser empacotados junto com o código fonte.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'react-router-dom',
        '@supabase/supabase-js'
      ]
    }
  }
})
