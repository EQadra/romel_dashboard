import axios from 'axios'

export function setupAxios() {
  axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  axios.defaults.withCredentials = true // Envía cookies a Laravel
  axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

  // Opcional: Interceptor de errores
  axios.interceptors.response.use(
    response => response,
    error => {
      // Puedes hacer logout automático si 401
      if (error.response?.status === 401) {
        console.warn('⚠️ Usuario no autenticado')
        // Por ejemplo, podrías redirigir a /login aquí
      }
      return Promise.reject(error)
    }
  )

  console.log('✅ Axios configurado con baseURL:', axios.defaults.baseURL)
}
