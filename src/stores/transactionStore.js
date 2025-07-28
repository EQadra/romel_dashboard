// stores/useTransactionsStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useTransactionsStore = defineStore('transactions', () => {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const todayTransactions = ref([])

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

  // Crear una transacción
  const createTransaction = async (payload) => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      await getCsrfToken()
      const { data } = await axios.post('http://localhost:8000/transaccion', payload)
      success.value = data.message
      await fetchTodayTransactions()
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al registrar transacción'
    } finally {
      loading.value = false
    }
  }

  // Obtener las transacciones del día
  const fetchTodayTransactions = async () => {
    loading.value = true
    error.value = null

    try {
      const { data } = await axios.get('http://localhost:8000/transacciones/dia')
      todayTransactions.value = data.data
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al cargar transacciones'
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    success,
    todayTransactions,
    createTransaction,
    fetchTodayTransactions,
  }
})
