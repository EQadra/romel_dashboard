<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">Gestión de Usuarios</h1>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        @click="startCreate"
      >
        + Agregar Usuario
      </button>
    </div>

    <EasyDataTable
      :headers="headers"
      :items="users"
      :loading="loading"
      class="rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <template #item-roles="{ roles }">
        <div class="flex flex-wrap gap-1">
          <span
            v-for="role in roles"
            :key="role.id"
            class="px-2 py-1 text-xs font-medium text-white bg-blue-500 rounded-full"
          >
            {{ role.name }}
          </span>
        </div>
      </template>

      <template #item-permissions="{ permissions }">
        <div class="flex flex-wrap gap-1 max-w-xs">
          <span
            v-for="perm in permissions"
            :key="perm.id"
            class="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded"
          >
            {{ perm.name }}
          </span>
        </div>
      </template>

      <template #item-actions="{ id }">
        <button
          class="px-3 py-1 text-sm text-white bg-indigo-600 rounded hover:bg-indigo-700"
          @click="selectUser(users.find(u => u.id === id))"
        >
          Editar
        </button>
      </template>
    </EasyDataTable>

    <div
      v-if="selectedUser"
      class="mt-8 p-4 border rounded-lg bg-white dark:bg-gray-800 dark:text-white"
    >
      <h2 class="text-lg font-semibold mb-4">{{ selectedUser.id ? 'Editar Usuario' : 'Nuevo Usuario' }}</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium">Nombre</label>
          <input v-model="form.name" type="text" class="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm font-medium">Email</label>
          <input v-model="form.email" type="email" class="w-full mt-1 p-2 border rounded" />
        </div>
        <div>
          <label class="block text-sm font-medium">Roles</label>
          <select v-model="form.roles" multiple class="w-full mt-1 p-2 border rounded">
            <option v-for="role in roles" :key="role.id" :value="role.name">{{ role.name }}</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium">Permisos relacionados</label>
          <div class="flex flex-wrap gap-1 mt-1">
            <span
              v-for="perm in relatedPermissions"
              :key="perm"
              class="px-2 py-1 text-xs bg-gray-300 text-gray-800 rounded"
            >
              {{ perm }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex gap-4 mt-6">
        <button
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          @click="saveChanges"
        >
          Guardar
        </button>
        <button
          class="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          @click="cancelEdit"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

import { useUsersStore } from '../../stores/UsersStore'
import { useRolesStore } from '../../stores/RolesStore'
import { useRolePermissionsStore } from '../../stores/RolePermissionsStore'
import { usePermissionsStore } from '../../stores/PermissionsStore'

const userStore = useUsersStore()
const rolesStore = useRolesStore()
const rolePermStore = useRolePermissionsStore()
const permissionsStore = usePermissionsStore()

const { users, loading } = storeToRefs(userStore)
const { roles } = storeToRefs(rolesStore)
const { allPermissions } = storeToRefs(rolePermStore)
const { permissions } = storeToRefs(permissionsStore)

const { fetchUsers, updateUser, createUser, syncRoles, syncPermissions } = userStore

const selectedUser = ref(null)
const form = ref({
  name: '',
  email: '',
  roles: [],
})

const headers = [
  { text: 'Nombre', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Roles', value: 'roles' },
  { text: 'Permisos', value: 'permissions' },
  { text: 'Acciones', value: 'actions' },
]

onMounted(async () => {
  await fetchUsers()
  await rolesStore.fetchRoles()
  await rolePermStore.fetchAllPermissions()
  await permissionsStore.fetchPermissions()
})

const relatedPermissions = computed(() => {
  const perms = new Set()
  form.value.roles.forEach(roleName => {
    const rolePerms = allPermissions.value.filter(p =>
      p.roles?.some(r => r.name === roleName)
    )
    rolePerms.forEach(p => perms.add(p.name))
  })
  return [...perms]
})

function selectUser(user) {
  selectedUser.value = user
  form.value = {
    name: user.name,
    email: user.email,
    roles: user.roles.map(r => r.name),
  }
}

function startCreate() {
  selectedUser.value = { id: null }
  form.value = { name: '', email: '', roles: [] }
}

function cancelEdit() {
  selectedUser.value = null
  form.value = { name: '', email: '', roles: [] }
}

async function saveChanges() {
  const userId = selectedUser.value?.id
  const payload = {
    name: form.value.name,
    email: form.value.email,
  }

  let id = userId
  if (id) {
    await updateUser(id, payload)
  } else {
    const newUser = await createUser(payload)
    id = newUser.id
  }

  await syncRoles(id, form.value.roles)
  await syncPermissions(id, relatedPermissions.value)

  await fetchUsers()
  cancelEdit()
}
</script>
