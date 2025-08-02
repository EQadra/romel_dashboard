// stores/useUsersStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import { getCsrfToken } from '../utils/csrf' // Asegúrate de que la ruta sea correcta

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  /** Obtener todos los usuarios */
  const fetchUsers = async () => {
    loading.value = true
    error.value = null
    try {
      const res = await axios.get('http://localhost:8000/usuarios')
      users.value = res.data
    } catch (err) {
      console.error('Error al obtener usuarios:', err)
      error.value = 'Error al cargar usuarios'
    } finally {
      loading.value = false
    }
  }

  /** Actualizar nombre / email / password / roles / permisos */
  const updateUser = async (id, payload) => {
    try {
      await getCsrfToken()
      const res = await axios.put(`http://localhost:8000/usuarios/${id}`, payload)
      const index = users.value.findIndex(u => u.id === id)
      if (index !== -1) {
        users.value[index] = res.data
      }
    } catch (err) {
      console.error(`Error al actualizar usuario ${id}:`, err)
    }
  }

  /** Sincronizar roles */
  const syncRoles = async (id, roles) => {
    try {
      await updateUser(id, { roles })
    } catch (err) {
      console.error(`Error al sincronizar roles del usuario ${id}:`, err)
    }
  }

  /** Sincronizar permisos */
  const syncPermissions = async (id, permissions) => {
    try {
      await updateUser(id, { permissions })
    } catch (err) {
      console.error(`Error al sincronizar permisos del usuario ${id}:`, err)
    }
  }

  return {
    users,
    loading,
    error,
    fetchUsers,
    updateUser,
    syncRoles,
    syncPermissions
  }
})
