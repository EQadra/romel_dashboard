import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useTransactionsStore = defineStore('transactions', () => {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const todayTransactions = ref([])

  // Crear una transacción
  const createTransaction = async (payload) => {
    loading.value = true
    error.value = null
    success.value = null

    try {
      const { data } = await axios.post('http://localhost:8000/api/transaccion', payload)
      success.value = data.message
      // Opcional: recargar la lista después de crear
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
      const { data } = await axios.get('http://localhost:8000/api/transacciones/dia')
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
