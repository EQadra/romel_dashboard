// stores/useAuthStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || '')

  // Datos simulados
  const fakeUser = {
    id: 1,
    name: 'Usuario Demo',
    email: 'demo@ejemplo.com',
    password:"password"
  }

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

  const login = async (email, password) => {
    await delay(500) // Simular latencia

    console.log("email:" + email + "password:" +"  " + password);
    // if (email === fakeUser.email && password === fakeUser.password) {
    //   token.value = 'fake-jwt-token'
    //   localStorage.setItem('token', token.value)
    //   user.value = fakeUser
      router.push('/dashboard')
    // } else {
    //   throw 'Credenciales inválidas'
    // }
    
  }

  const register = async (name, email, password) => {
    await delay(500)
    // No se guarda realmente nada, solo se simula el éxito
    router.push('/verify')
  }

  const verifyAccount = async (email, code) => {
    await delay(500)
    token.value = 'fake-jwt-token'
    localStorage.setItem('token', token.value)
    user.value = fakeUser
    router.push('/dashboard')
  }

  const fetchUser = async () => {
    await delay(300)
    if (token.value === 'fake-jwt-token') {
      user.value = fakeUser
    } else {
      logout()
    }
  }

  const logout = async () => {
    await delay(200)
    user.value = null
    token.value = ''
    localStorage.removeItem('token')
    router.push('/login')
  }

  const sendResetLink = async (email) => {
    await delay(300)
    if (email === fakeUser.email) {
      return 'Enlace de restablecimiento enviado'
    } else {
      throw 'Correo no encontrado'
    }
  }

  const resetPassword = async ({ email, token: resetToken, password, password_confirmation }) => {
    await delay(300)
    if (email === fakeUser.email && resetToken === 'valid-token') {
      return 'Contraseña actualizada correctamente'
    } else {
      throw 'Token inválido o datos incorrectos'
    }
  }

  return {
    user,
    token,
    login,
    register,
    verifyAccount,
    logout,
    fetchUser,
    sendResetLink,
    resetPassword,
  }
})
