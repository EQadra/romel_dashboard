// stores/useRolePermissionsStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useRolePermissionsStore = defineStore('rolePermissions', {
  state: () => ({
    allPermissions: [],
    assignedPermissions: [],
    loading: false
  }),

  actions: {
    async getCsrfToken() {
      try {
        await axios.get('/sanctum/csrf-cookie')
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('XSRF-TOKEN='))
          ?.split('=')[1]

        if (!token) throw new Error('XSRF-TOKEN no encontrado en cookies')

        axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token)
        console.log('✅ CSRF token enviado:', decodeURIComponent(token))
      } catch (err) {
        console.error('❌ Error obteniendo CSRF cookie', err)
        throw new Error('No se pudo obtener el token CSRF')
      }
    },

    async fetchAllPermissions() {
      const res = await axios.get('http://localhost:8000/permisos')
      this.allPermissions = res.data
    },

    async fetchAssignedPermissions(roleId) {
      const res = await axios.get(`http://localhost:8000/roles/${roleId}/permisos`)
      this.assignedPermissions = res.data.map(p => p.name)
    },

    async assignPermission(roleId, permission) {
      await this.getCsrfToken()
      await axios.post(`http://localhost:8000/roles/${roleId}/permisos/asignar`, {
        permission
      })
      this.assignedPermissions.push(permission)
    },

    async revokePermission(roleId, permission) {
      await this.getCsrfToken()
      await axios.post(`http://localhost:8000/roles/${roleId}/permisos/revocar`, {
        permission
      })
      this.assignedPermissions = this.assignedPermissions.filter(p => p !== permission)
    }
  }
})
