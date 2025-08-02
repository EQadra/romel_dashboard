// src/utils/csrf.js
import axios from 'axios'

export const getCsrfToken = async () => {
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
