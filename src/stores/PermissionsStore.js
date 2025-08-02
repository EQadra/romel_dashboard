import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { getCsrfToken } from '../utils/csrf' // Ruta relativa a tu estructura de carpetas

export const usePermissionsStore = defineStore('permissions', () => {
  const permissions = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchPermissions = async () => {
    loading.value = true
    try {
      const res = await axios.get('http://localhost:8000/permisos')
      permissions.value = res.data
    } catch (err) {
      console.error('Error al cargar permissions:', err)
      error.value = 'Error al cargar permissions'
    } finally {
      loading.value = false
    }
  }

  const createPermission = async (name) => {
    try {
      await getCsrfToken()
      const res = await axios.post('http://localhost:8000/permisos', { name })
      permissions.value.push(res.data)
    } catch (err) {
      console.error('Error al crear permiso:', err)
      throw err
    }
  }

  const updatePermission = async (id, name) => {
    try {
      await getCsrfToken()
      const res = await axios.put(`http://localhost:8000/permisos/${id}`, { name })
      const index = permissions.value.findIndex(p => p.id === id)
      if (index !== -1) permissions.value[index] = res.data
    } catch (err) {
      console.error('Error al actualizar permiso:', err)
      throw err
    }
  }

  const deletePermission = async (id) => {
    try {
      await getCsrfToken()
      await axios.delete(`http://localhost:8000/permisos/${id}`)
      permissions.value = permissions.value.filter(p => p.id !== id)
    } catch (err) {
      console.error('Error al eliminar permiso:', err)
      throw err
    }
  }

  return {
    permissions,
    loading,
    error,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission
  }
})
