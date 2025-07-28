import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true // Necesario para enviar cookies con Laravel

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)
  const error = ref(null)

  const getCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie')
  
      // 🔐 Leer el valor de la cookie XSRF-TOKEN
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
  
      if (!token) {
        throw new Error('XSRF-TOKEN no encontrado en cookies')
      }
  
      // ✅ Agregar manualmente el header
      axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token)
  
      console.log('✅ CSRF token enviado:', decodeURIComponent(token))
    } catch (err) {
      console.error('❌ Error obteniendo CSRF cookie', err)
      throw new Error('No se pudo obtener el token CSRF')
    }
  }

  const login = async (email, password) => {
    loading.value = true
    error.value = null
    try {
      await getCsrfToken()
      await axios.post('/login', { email, password })

      await fetchUser()
      router.push('/dashboard')
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      console.error('❌ Login fallido:', error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const register = async (name, email, password) => {
    loading.value = true
    error.value = null
    try {
      await getCsrfToken()
      await axios.post('/register', { name, email, password })
      router.push('/verify') // Redirige a verificación si aplica
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al registrarse'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get('/profile') // Usa el endpoint autenticado
      user.value = res.data.user || res.data
      localStorage.setItem('user', JSON.stringify(user.value))
    } catch (err) {
      console.warn('⚠️ No autenticado:', err.response?.status)
      user.value = null
      localStorage.removeItem('user')
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (err) {
      console.warn('⚠️ Error al cerrar sesión:', err.message)
    }
    user.value = null
    localStorage.removeItem('user')
    router.push('/login')
  }

  return {
    user,
    loading,
    error,
    login,
    register,
    fetchUser,
    logout,
  }
})
