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
    async fetchAllPermissions() {
      const res = await axios.get('http://localhost:8000/api/permisos')
      this.allPermissions = res.data
    },

    async fetchAssignedPermissions(roleId) {
      const res = await axios.get(`http://localhost:8000/api/roles/${roleId}/permisos`)
      this.assignedPermissions = res.data.map(p => p.name)
    },

    async assignPermission(roleId, permission) {
      await axios.post(`http://localhost:8000/api/roles/${roleId}/permisos/asignar`, {
        permission
      })
      this.assignedPermissions.push(permission)
    },

    async revokePermission(roleId, permission) {
      await axios.post(`http://localhost:8000/api/roles/${roleId}/permisos/revocar`, {
        permission
      })
      this.assignedPermissions = this.assignedPermissions.filter(p => p !== permission)
    }
  }
})
