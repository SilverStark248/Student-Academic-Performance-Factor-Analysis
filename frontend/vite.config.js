import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/get_students': 'http://127.0.0.1:5000',
      '/add_student': 'http://127.0.0.1:5000',
      '/update_student': 'http://127.0.0.1:5000',
      '/delete_student': 'http://127.0.0.1:5000',
      '/analyze_data': 'http://127.0.0.1:5000',
      '/predict_marks': 'http://127.0.0.1:5000',
      '/dashboard': 'http://127.0.0.1:5000',
    }
  }
})