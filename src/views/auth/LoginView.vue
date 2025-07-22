<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-2xl font-bold text-gray-700 mb-6 flex items-center gap-2">
        <LogIn class="w-6 h-6" /> Iniciar sesión
      </h2>
      <form @submit.prevent="onSubmit" class="space-y-4">
        <input v-model="email" type="email" placeholder="Correo electrónico"
               class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
        <input v-model="password" type="password" placeholder="Contraseña"
               class="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500" required />
        <button type="submit"
                class="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition">
          Entrar
        </button>
      </form>
      <div class="mt-4 text-sm text-gray-500 flex justify-between">
        <RouterLink to="/register" class="text-blue-600 hover:underline">Registrarse</RouterLink>
        <RouterLink to="/forgot-password" class="text-blue-600 hover:underline">¿Olvidaste tu contraseña?</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Swal from 'sweetalert2'
import { LogIn } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/AuthStore'

const store = useAuthStore()
const email = ref('')
const password = ref('')

const onSubmit = async () => {
  try {
    await store.login(email.value.trim(), password.value.trim())
    Swal.fire({
      icon: 'success',
      title: 'Bienvenido',
      showConfirmButton: false,
      timer: 1500
    })
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err
    })
  }
}
</script>
