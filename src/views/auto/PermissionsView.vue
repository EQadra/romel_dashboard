<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Gestión de Permisos</h2>

    <!-- Botón Crear -->
    <div class="mb-4 flex justify-between items-center">
      <input
        v-model="search"
        type="text"
        placeholder="Buscar permiso..."
        class="border px-3 py-2 rounded w-1/2"
      />
      <button
        @click="showCreateModal"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear Permiso
      </button>
    </div>

    <!-- Tabla -->
    <EasyDataTable
      :headers="headers"
      :items="filteredPermissions"
      :loading="loading"
      :search-value="search"
      table-class-name="customize-table"
      header-text-direction="center"
      body-text-direction="left"
      theme-color="#2563eb"
    >
      <template #item-actions="{ id, name }">
        <div class="space-x-2 text-center">
          <button
            @click="showEditModal({ id, name })"
            class="text-blue-600 hover:underline"
          >
            Editar
          </button>
          <button
            @click="confirmDelete(id)"
            class="text-red-600 hover:underline"
          >
            Eliminar
          </button>
        </div>
      </template>
    </EasyDataTable>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { usePermissionsStore } from '../../stores/PermissionsStore'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

// Store
const store = usePermissionsStore()
const { permissions, loading, error } = storeToRefs(store)
const {
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission,
} = store

// Estado local
const search = ref('')

// Columnas de tabla
const headers = [
  { text: 'ID', value: 'id', sortable: true },
  { text: 'Nombre', value: 'name', sortable: true },
  { text: 'Acciones', value: 'actions', sortable: false },
]

// Buscar sincrónicamente
const filteredPermissions = computed(() => {
  return permissions.value
})

// Carga inicial
onMounted(() => {
  fetchPermissions()
})

// Crear permiso
const showCreateModal = async () => {
  const { value: name } = await Swal.fire({
    title: 'Crear Permiso',
    input: 'text',
    inputLabel: 'Nombre del permiso',
    inputPlaceholder: 'ej: editar artículos',
    showCancelButton: true,
    confirmButtonText: 'Crear',
    preConfirm: value => {
      if (!value) Swal.showValidationMessage('El nombre es obligatorio')
    }
  })

  if (name) {
    try {
      await createPermission(name)
      Swal.fire('¡Creado!', 'El permiso fue creado correctamente.', 'success')
    } catch {
      Swal.fire('Error', 'No se pudo crear el permiso.', 'error')
    }
  }
}

// Editar permiso
const showEditModal = async (perm) => {
  const { value: newName } = await Swal.fire({
    title: 'Editar Permiso',
    input: 'text',
    inputLabel: 'Nuevo nombre',
    inputValue: perm.name,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    preConfirm: value => {
      if (!value) Swal.showValidationMessage('El nombre es obligatorio')
    }
  })

  if (newName && newName !== perm.name) {
    try {
      await updatePermission(perm.id, newName)
      Swal.fire('¡Actualizado!', 'El permiso fue actualizado.', 'success')
    } catch {
      Swal.fire('Error', 'No se pudo actualizar.', 'error')
    }
  }
}

// Eliminar permiso
const confirmDelete = async (id) => {
  const confirm = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (confirm.isConfirmed) {
    try {
      await deletePermission(id)
      Swal.fire('Eliminado', 'El permiso fue eliminado.', 'success')
    } catch {
      Swal.fire('Error', 'No se pudo eliminar el permiso.', 'error')
    }
  }
}
</script>

<style scoped>
/* Estilos personalizados para la tabla si deseas */
.customize-table {
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}
</style>
