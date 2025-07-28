import { defineStore } from 'pinia'
import axios from 'axios'

export const useCashRegisterStore = defineStore('CashRegister', {
  state: () => ({
    cashRegister: null,
    loading: false,
    error: null,
  }),

  actions: {
    async getCsrfToken() {
      try {
        await axios.get('/sanctum/csrf-cookie')

        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1]

        if (!token) {
          throw new Error('XSRF-TOKEN no encontrado en cookies')
        }

        axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token)
        console.log('✅ CSRF token enviado:', decodeURIComponent(token))
      } catch (err) {
        console.error('❌ Error obteniendo CSRF cookie', err)
        throw new Error('No se pudo obtener el token CSRF')
      }
    },

    async fetchToday() {
      this.loading = true
      try {
        const res = await axios.get('/caja/actual')
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
        await this.getCsrfToken() // ✅ Obtener CSRF antes de enviar POST
        const res = await axios.post('/caja/abrir', data)
        this.cashRegister = res.data.data
      } catch (err) {
        throw err.response?.data?.message || 'Error al abrir caja'
      } finally {
        this.loading = false
      }
    },

    async closeCash(data) {
      this.loading = true
      try {
        await this.getCsrfToken() // ✅ Obtener CSRF antes de enviar POST
        const res = await axios.post('/caja/cerrar', data)
        this.cashRegister = res.data.data
      } catch (err) {
        throw err.response?.data?.message || 'Error al cerrar caja'
      } finally {
        this.loading = false
      }
    },
  },
})
