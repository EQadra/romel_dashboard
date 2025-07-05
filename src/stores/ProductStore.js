import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useProductStore = defineStore('product', () => {
  const products = ref([])

  // Obtener todos los productos
  async function fetchAll() {
    try {
      const res = await axios.get('/api/products')
      products.value = res.data
    } catch (error) {
      console.error('Error al obtener productos:', error)
    }
  }

  // Crear un producto
  async function create(formData) {
    try {
      const res = await axios.post('/api/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      products.value.push(res.data)
    } catch (error) {
      console.error('Error al crear producto:', error)
    }
  }

  // Actualizar un producto
  async function update(id, formData) {
    try {
      const res = await axios.post(`/api/products/${id}?_method=PUT`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = res.data
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error)
    }
  }

  // Eliminar un producto
  async function remove(id) {
    try {
      await axios.delete(`/api/products/${id}`)
      products.value = products.value.filter(p => p.id !== id)
    } catch (error) {
      console.error('Error al eliminar producto:', error)
    }
  }

  return {
    products,
    fetchAll,
    create,
    update,
    remove
  }
})
