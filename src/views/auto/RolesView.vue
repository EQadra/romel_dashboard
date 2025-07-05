<template>
  <div class="p-4">
    <h1 class="mb-6 text-2xl font-bold">Gestión de Roles</h1>

    <div class="flex flex-wrap items-center gap-4 mb-4">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar rol por nombre..."
        class="border rounded px-3 py-2 w-full md:w-1/3"
      />
      <button
        @click="addRole"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        ➕ Nuevo Rol
      </button>
    </div>

    <easy-data-table
      class="rounded-lg overflow-hidden border"
      :headers="headers"
      :items="filteredRoles"
      :loading="store.loading"
    >
      <template #item-actions="{ id, name }">
        <div class="flex gap-2">
          <button @click="editRole(id, name)" class="text-blue-600 hover:underline">✏️</button>
          <button @click="deleteRole(id, name)" class="text-red-600 hover:underline">🗑️</button>
        </div>
      </template>
    </easy-data-table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRolesStore } from '../../stores/RoleStore.js'
import Swal from 'sweetalert2'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const store = useRolesStore()
const search = ref('')

const headers = [
  { text: 'ID', value: 'id' },
  { text: 'Nombre', value: 'name' },
  { text: 'Acciones', value: 'actions' }
]

const filteredRoles = computed(() =>
  store.roles.filter(role =>
    role.name.toLowerCase().includes(search.value.toLowerCase())
  )
)

onMounted(() => store.fetchRoles())

const addRole = async () => {
  const { value: name } = await Swal.fire({
    title: 'Nuevo Rol',
    input: 'text',
    inputLabel: 'Nombre del Rol',
    inputPlaceholder: 'admin, editor...',
    showCancelButton: true,
    inputValidator: value => !value && 'El nombre es requerido'
  })

  if (name) {
    try {
      await store.createRole(name)
      Swal.fire('Rol creado', '', 'success')
    } catch (error) {
      Swal.fire('Error al crear rol', error.response?.data?.message || 'Error', 'error')
    }
  }
}

const editRole = async (id, currentName) => {
  const { value: name } = await Swal.fire({
    title: 'Editar Rol',
    input: 'text',
    inputLabel: 'Nombre del Rol',
    inputValue: currentName,
    showCancelButton: true,
    inputValidator: value => !value && 'El nombre es requerido'
  })

  if (name && name !== currentName) {
    try {
      await store.updateRole(id, name)
      Swal.fire('Rol actualizado', '', 'success')
    } catch (error) {
      Swal.fire('Error al actualizar rol', error.response?.data?.message || 'Error', 'error')
    }
  }
}

const deleteRole = async (id, name) => {
  const result = await Swal.fire({
    title: `¿Eliminar rol "${name}"?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    try {
      await store.deleteRole(id)
      Swal.fire('Rol eliminado', '', 'success')
    } catch (error) {
      Swal.fire('Error al eliminar rol', error.response?.data?.message || 'Error', 'error')
    }
  }
}
</script>

<style scoped>
button {
  font-weight: 500;
}
</style>
