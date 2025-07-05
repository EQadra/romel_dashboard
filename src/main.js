import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './style.css'
import App from './App.vue'
import router from './router' // Asegúrate de tener Vue Router configurado



const app = createApp(App)

app.use(createPinia())  // Activar Pinia
app.use(router)         // Activar Vue Router

app.mount('#app')