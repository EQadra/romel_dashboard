<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold mb-4">Gestión de Permisos</h2>

    <button
      @click="showCreateModal"
      class="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
    >
      Crear Permiso
    </button>

    <!-- Mensajes de carga / error opcionales -->
    <p v-if="loading" class="mb-2">Cargando…</p>
    <p v-if="error" class="mb-2 text-red-600">{{ error }}</p>

    <table class="w-full table-auto border border-gray-300">
      <thead class="bg-gray-100">
        <tr>
          <th class="border p-2 text-left">ID</th>
          <th class="border p-2 text-left">Nombre</th>
          <th class="border p-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="perm in permissions" :key="perm.id">
          <td class="border p-2">{{ perm.id }}</td>
          <td class="border p-2">{{ perm.name }}</td>
          <td class="border p-2 text-center space-x-2">
            <button
              @click="showEditModal(perm)"
              class="text-blue-600 hover:underline"
            >
              Editar
            </button>
            <button
              @click="confirmDelete(perm.id)"
              class="text-red-600 hover:underline"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Swal from 'sweetalert2'
import { storeToRefs } from 'pinia'
import { usePermissionsStore } from '../../stores/PermissionsStore'

/* 1️⃣  Instancia única del store */
const store = usePermissionsStore()

/* 2️⃣  Mantén el estado como refs reactivos */
const { permissions, loading, error } = storeToRefs(store)

/* 3️⃣  Acciones (no necesitan refs) */
const {
  fetchPermissions,
  createPermission,
  updatePermission,
  deletePermission
} = store

/* 4️⃣  Carga inicial */
onMounted(() => {
  fetchPermissions()
})

/* 5️⃣  UI helpers --------------------------------------------------------- */
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

const showEditModal = async perm => {
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

const confirmDelete = async id => {
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
/* (Tu CSS de interruptor que aún no utilizas en este componente) */
.switch { position: relative; display: inline-block; width: 42px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0;
          background-color: #ccc; transition: .4s; border-radius: 24px; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px;
                 bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #4caf50; }
input:checked + .slider:before { transform: translateX(18px); }
</style>
