import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/get_students': 'https://student-academic-performance-factor.onrender.com',
      '/add_student': 'https://student-academic-performance-factor.onrender.com',
      '/update_student': 'https://student-academic-performance-factor.onrender.com',
      '/delete_student': 'https://student-academic-performance-factor.onrender.com',
      '/analyze_data': 'https://student-academic-performance-factor.onrender.com',
      '/predict_marks': 'https://student-academic-performance-factor.onrender.com',
      '/dashboard': 'https://student-academic-performance-factor.onrender.com',
    }
  }
})