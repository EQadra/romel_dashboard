import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const loading = ref(false)
  const error = ref(null)

  // Función interna para obtener el token CSRF
  const getCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie')
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]

      if (!token) throw new Error('XSRF-TOKEN no encontrado en cookies')
      axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token)
    } catch (err) {
      console.error('❌ Error obteniendo CSRF cookie', err)
      throw new Error('No se pudo obtener el token CSRF')
    }
  }

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

  /** Actualizar nombre / email / password */
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
