<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

    <div v-if="loading">Cargando usuarios...</div>
    <div v-else-if="error" class="text-red-500">{{ error }}</div>

    <!-- Tabla de usuarios -->
    <div v-else>
      <table class="w-full border">
        <thead class="bg-gray-100">
          <tr>
            <th class="p-2 text-left">Nombre</th>
            <th class="p-2 text-left">Email</th>
            <th class="p-2 text-left">Roles</th>
            <th class="p-2 text-left">Permisos</th>
            <th class="p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="border-t">
            <td class="p-2">{{ user.name }}</td>
            <td class="p-2">{{ user.email }}</td>
            <td class="p-2">
              <span
                v-for="role in user.roles"
                :key="role.id"
                class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1"
              >
                {{ role.name }}
              </span>
            </td>
            <td class="p-2">
              <span
                v-for="perm in user.permissions"
                :key="perm.id"
                class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1"
              >
                {{ perm.name }}
              </span>
            </td>
            <td class="p-2 text-center">
              <button
                @click="selectUser(user)"
                class="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
              >
                Editar
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Panel de edición -->
    <div v-if="selectedUser" class="mt-6 border-t pt-4">
      <h2 class="text-xl font-semibold mb-2">Editar Usuario</h2>
      <form @submit.prevent="saveChanges">
        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm mb-1">Nombre</label>
            <input
              v-model="form.name"
              type="text"
              class="w-full border px-2 py-1 rounded"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              class="w-full border px-2 py-1 rounded"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label class="block text-sm mb-1">Roles (coma-separados)</label>
            <input
              v-model="form.roles"
              type="text"
              class="w-full border px-2 py-1 rounded"
              placeholder="admin,editor"
            />
          </div>
          <div>
            <label class="block text-sm mb-1">Permisos (coma-separados)</label>
            <input
              v-model="form.permissions"
              type="text"
              class="w-full border px-2 py-1 rounded"
              placeholder="crear,editar"
            />
          </div>
        </div>

        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Guardar
          </button>
          <button
            type="button"
            @click="cancelEdit"
            class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '../../stores/UsersStore'
import { storeToRefs } from 'pinia'

const userStore = useUsersStore()

// ⚠️ Corrección: reactividad funcional usando storeToRefs
const { users, loading, error } = storeToRefs(userStore)

// Acciones (pueden desestructurarse directamente)
const { fetchUsers, updateUser, syncRoles, syncPermissions } = userStore

const selectedUser = ref(null)
const form = ref({
  name: '',
  email: '',
  roles: '',
  permissions: '',
})

onMounted(() => {
  fetchUsers()
})

function selectUser(user) {
  selectedUser.value = user
  form.value = {
    name: user.name,
    email: user.email,
    roles: user.roles.map(r => r.name).join(','),
    permissions: user.permissions.map(p => p.name).join(','),
  }
}

function cancelEdit() {
  selectedUser.value = null
}

async function saveChanges() {
  const id = selectedUser.value.id

  await updateUser(id, {
    name: form.value.name,
    email: form.value.email,
  })

  const roleArray = form.value.roles.split(',').map(r => r.trim()).filter(Boolean)
  await syncRoles(id, roleArray)

  const permArray = form.value.permissions.split(',').map(p => p.trim()).filter(Boolean)
  await syncPermissions(id, permArray)

  await fetchUsers()
  selectedUser.value = null
}
</script>

<style scoped>
table th,
table td {
  border: 1px solid #ddd;
}
</style>
