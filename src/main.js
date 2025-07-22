import { createApp, watch } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

import axios from 'axios'
import { useAuthStore } from './stores/AuthStore'

// ✅ Configurar base URL de Axios
axios.defaults.baseURL = 'http://localhost:8000'

// Crear app
const app = createApp(App)

// Crear e instalar Pinia antes de usar cualquier store
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')

// ✅ Usar el store después de que Pinia está instalado
const auth = useAuthStore()

// ✅ Leer token desde localStorage y setear encabezado global si existe
if (auth.token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`
}

// ✅ Sincronizar token reactivo con Axios
watch(
  () => auth.token,
  (newToken) => {
    if (newToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`
    } else {
      delete axios.defaults.headers.common['Authorization']
    }
  },
  { immediate: true }
)
