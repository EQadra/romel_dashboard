import { defineStore } from 'pinia'
import axios from 'axios'

export const useCashRegisterStore = defineStore('cashRegister', {
  state: () => ({
    cashRegister: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchToday() {
      this.loading = true
      try {
        const res = await axios.get('/api/cash-register/actual')
        this.cashRegister = res.data.data
      } catch (err) {
        this.cashRegister = null
      } finally {
        this.loading = false
      }
    },
    async openCash(data) {
      this.loading = true
      try {
        const res = await axios.post('/api/cash-register/abrir', data)
        this.cashRegister = res.data.data
      } catch (err) {
        throw err.response.data.message || 'Error al abrir caja'
      } finally {
        this.loading = false
      }
    },
    async closeCash(data) {
      this.loading = true
      try {
        const res = await axios.post('/api/cash-register/cerrar', data)
        this.cashRegister = res.data.data
      } catch (err) {
        throw err.response.data.message || 'Error al cerrar caja'
      } finally {
        this.loading = false
      }
    },
  },
})
