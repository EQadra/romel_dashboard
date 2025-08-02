import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { getCsrfToken } from '../utils/csrf' // Asegúrate que esta ruta es correcta

// Axios base config
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

export const useRolesStore = defineStore('roles', () => {
  const roles = ref([])
  const loading = ref(false)

  const fetchRoles = async () => {
    loading.value = true
    try {
      const res = await axios.get('/roles')
      roles.value = res.data
    } catch (err) {
      console.error('Error al obtener roles:', err)
    } finally {
      loading.value = false
    }
  }

  const createRole = async (name) => {
    try {
      await getCsrfToken()
      const res = await axios.post('/roles', { name })
      roles.value.push(res.data)
    } catch (err) {
      console.error('Error al crear rol:', err)
      throw err
    }
  }

  const updateRole = async (id, name) => {
    try {
      await getCsrfToken()
      const res = await axios.put(`/roles/${id}`, { name })
      const index = roles.value.findIndex(role => role.id === id)
      if (index !== -1) roles.value[index] = res.data
    } catch (err) {
      console.error('Error al actualizar rol:', err)
      throw err
    }
  }

  const deleteRole = async (id) => {
    try {
      await getCsrfToken()
      await axios.delete(`/roles/${id}`)
      roles.value = roles.value.filter(role => role.id !== id)
    } catch (err) {
      console.error('Error al eliminar rol:', err)
      throw err
    }
  }

  return {
    roles,
    loading,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
  }
})
