import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

// ✅ Axios: configuración en archivo separado
import { setupAxios } from './plugins/axios'

// Crea instancia de app
const app = createApp(App)

// Plugins
app.use(createPinia())
app.use(router)

// Axios global config
setupAxios()

// Monta app
app.mount('#app')
