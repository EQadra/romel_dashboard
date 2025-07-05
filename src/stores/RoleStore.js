import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useRolesStore = defineStore('roles', () => {
  const roles = ref([])
  const loading = ref(false)

  const fetchRoles = async () => {
    loading.value = true
    try {
      const res = await axios.get('http://localhost:8000/api/roles')
      roles.value = res.data
    } catch (err) {
      console.error('Error al obtener roles:', err)
    } finally {
      loading.value = false
    }
  }

  const createRole = async (name) => {
    const res = await axios.post('http://localhost:8000/api/roles', { name })
    roles.value.push(res.data)
  }

  const updateRole = async (id, name) => {
    const res = await axios.put(`http://localhost:8000/api/roles/${id}`, { name })
    const index = roles.value.findIndex(role => role.id === id)
    if (index !== -1) roles.value[index] = res.data
  }

  const deleteRole = async (id) => {
    await axios.delete(`http://localhost:8000/api/roles/${id}`)
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
