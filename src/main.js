import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

import axios from 'axios'

// ✅ Axios global setup
axios.defaults.baseURL = 'http://localhost:8000'
axios.defaults.withCredentials = true // Requiere cookies de sesión
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest' // Evita redirecciones HTML

const app = createApp(App)

// ✅ Setup Pinia y router
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')
