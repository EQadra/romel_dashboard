import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

// Configuración global de Axios
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true // Requiere para usar cookies con Laravel

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Obtener cookie CSRF (necesario antes de login o registro)
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
    error.value = null
    loading.value = true
    try {
      await getCsrfToken()
      const res = await axios.post('/login', { email, password })
      console.log('✅ Login response:', res)
  
      await fetchUser()
      console.log('✅ Usuario cargado:', user.value)
  
      if (user.value) {
        router.push('/dashboard')
      } else {
        throw new Error('Usuario no disponible después del login')
      }
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al iniciar sesión'
      console.error('❌ Login fallido:', error.value)
      throw error.value
    } finally {
      loading.value = false
    }
  }
  

  const register = async (name, email, password) => {
    error.value = null
    loading.value = true
    try {
      await getCsrfToken()
      await axios.post('/register', { name, email, password })
      router.push('/verify')
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al registrarse'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const verifyAccount = async (email, code) => {
    error.value = null
    loading.value = true
    try {
      await getCsrfToken()
      await axios.post('/verify-account', { email, code })
      await fetchUser()
      router.push('/dashboard')
    } catch (err) {
      error.value = err.response?.data?.message || 'Error al verificar cuenta'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get('/me') // Ruta web protegida por auth
      user.value = res.data.user || res.data
    } catch (err) {
      console.warn('⚠️ No autenticado:', err.response?.status)
      user.value = null
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (err) {
      console.warn('Logout fallido o ya cerrada la sesión')
    }
    user.value = null
    router.push('/login')
  }

  return {
    user,
    error,
    loading,
    login,
    register,
    verifyAccount,
    fetchUser,
    logout,
  }
})
