// stores/useRolePermissionsStore.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { getCsrfToken } from '../utils/csrf' // Ajusta la ruta si es necesario

export const useRolePermissionsStore = defineStore('rolePermissions', {
  state: () => ({
    allPermissions: [],
    assignedPermissions: [],
    loading: false
  }),

  actions: {
    async fetchAllPermissions() {
      try {
        const res = await axios.get('http://localhost:8000/permisos')
        this.allPermissions = res.data
      } catch (error) {
        console.error('Error al obtener todos los permisos:', error)
      }
    },

    async fetchAssignedPermissions(roleId) {
      try {
        const res = await axios.get(`http://localhost:8000/roles/${roleId}/permisos`)
        this.assignedPermissions = res.data.map(p => p.name)
      } catch (error) {
        console.error('Error al obtener permisos asignados:', error)
      }
    },

    async assignPermission(roleId, permission) {
      try {
        await getCsrfToken()
        await axios.post(`http://localhost:8000/roles/${roleId}/permisos/asignar`, { permission })
        this.assignedPermissions.push(permission)
      } catch (error) {
        console.error('Error al asignar permiso:', error)
      }
    },

    async revokePermission(roleId, permission) {
      try {
        await getCsrfToken()
        await axios.post(`http://localhost:8000/roles/${roleId}/permisos/revocar`, { permission })
        this.assignedPermissions = this.assignedPermissions.filter(p => p !== permission)
      } catch (error) {
        console.error('Error al revocar permiso:', error)
      }
    }
  }
})
