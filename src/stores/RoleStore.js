import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

// Axios base config
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true

export const useRolesStore = defineStore('roles', () => {
  const roles = ref([])
  const loading = ref(false)

  const getCsrfToken = async () => {
    try {
      await axios.get('/sanctum/csrf-cookie')
  
      // 🔐 Leer el valor de la cookie XSRF-TOKEN
      const token = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1]
  
      if (!token) {
        throw new Error('XSRF-TOKEN no encontrado en cookies')
      }
  
      // ✅ Agregar manualmente el header
      axios.defaults.headers.common['X-XSRF-TOKEN'] = decodeURIComponent(token)
  
      console.log('✅ CSRF token enviado:', decodeURIComponent(token))
    } catch (err) {
      console.error('❌ Error obteniendo CSRF cookie', err)
      throw new Error('No se pudo obtener el token CSRF')
    }
  }

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
    await getCsrfToken()
    const res = await axios.post('/roles', { name })
    roles.value.push(res.data)
  }

  const updateRole = async (id, name) => {
    await getCsrfToken()
    const res = await axios.put(`/roles/${id}`, { name })
    const index = roles.value.findIndex(role => role.id === id)
    if (index !== -1) roles.value[index] = res.data
  }

  const deleteRole = async (id) => {
    await getCsrfToken()
    await axios.delete(`/roles/${id}`)
    roles.value = roles.value.filter(role => role.id !== id)
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
