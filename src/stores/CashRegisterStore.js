import { defineStore } from 'pinia'
import axios from 'axios'
import { getCsrfToken } from '../utils/csrf' // ajusta esta ruta según tu estructura

export const useCashRegisterStore = defineStore('CashRegister', {
  state: () => ({
    cashRegister: null,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchToday() {
      this.loading = true
      try {
        const res = await axios.get('/caja/actual')
        this.cashRegister = res.data.data
      } catch (err) {
        this.cashRegister = null
        this.error = 'Error al cargar caja actual'
        console.error(err)
      } finally {
        this.loading = false
      }
    },

    async openCash(data) {
      this.loading = true
      try {
        await getCsrfToken()
        const res = await axios.post('/caja/abrir', data)
        this.cashRegister = res.data.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al abrir caja'
        throw this.error
      } finally {
        this.loading = false
      }
    },

    async closeCash(data) {
      this.loading = true
      try {
        await getCsrfToken()
        const res = await axios.post('/caja/cerrar', data)
        this.cashRegister = res.data.data
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al cerrar caja'
        throw this.error
      } finally {
        this.loading = false
      }
    },
  },
})
