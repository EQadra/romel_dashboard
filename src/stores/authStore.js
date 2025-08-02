import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // Usa la instancia ya configurada

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)
  const loading = ref(false)
  const error = ref(null)

  const saveUser = (data) => {
    user.value = data
    localStorage.setItem('user', JSON.stringify(data))
  }

  const clearUser = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  const getCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie')
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]

      if (!token) throw new Error('XSRF-TOKEN no encontrado en cookies')
      axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token)
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
      const msg = err.response?.data?.message || 'Error al iniciar sesión'
      console.error('❌ Login fallido:', msg)
      error.value = msg
      throw msg
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
      router.push('/verify')
    } catch (err) {
      const msg = err.response?.data?.message || 'Error al registrarse'
      console.error('❌ Registro fallido:', msg)
      error.value = msg
      throw msg
    } finally {
      loading.value = false
    }
  }

  const fetchUser = async () => {
    try {
      const res = await axios.get('/profile')
      const { id, name, email } = res.data.user
      saveUser({ id, name, email })
    } catch (err) {
      console.warn('⚠️ No autenticado:', err.response?.status)
      clearUser()
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (err) {
      console.warn('⚠️ Error al cerrar sesión:', err.message)
    }
    clearUser()
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
