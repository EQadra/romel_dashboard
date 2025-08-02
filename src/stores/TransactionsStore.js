// stores/useTransactionsStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { getCsrfToken } from '../utils/csrf' // ajusta la ruta si es necesario

export const useTransactionsStore = defineStore('transactions', () => {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(null)
  const todayTransactions = ref([])

  // 🟢 Crear una transacción normal
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

  // 📅 Obtener las transacciones del día
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

  // 🧾 Guardar cálculo desde la calculadora de oro
  const saveGoldCalculation = async (payload) => {
    loading.value = true
    success.value = null
    error.value = null

    try {
      await getCsrfToken()
      const { data } = await axios.post('http://localhost:8000/api/calculos', payload)
      success.value = data.message || 'Cálculo guardado exitosamente'
    } catch (e) {
      error.value = e.response?.data?.message || 'Error al guardar cálculo'
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
    saveGoldCalculation,
  }
})
