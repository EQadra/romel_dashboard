<template>
    <div class="p-6 max-w-4xl mx-auto">
      <h2 class="text-3xl font-bold mb-6 text-indigo-700 dark:text-indigo-300">
        Permisos del Rol: <span class="capitalize">{{ roleName }}</span>
      </h2>
  
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div
          v-for="perm in store.allPermissions"
          :key="perm.id"
          class="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-shadow duration-300 group"
        >
          <span class="text-gray-800 dark:text-gray-200 font-medium group-hover:text-indigo-600 transition-colors duration-200">
            {{ perm.name }}
          </span>
          <input
            type="checkbox"
            :checked="store.assignedPermissions.includes(perm.name)"
            @change="togglePermission(perm.name)"
            class="h-5 w-5 text-indigo-600 transition-transform transform hover:scale-110"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, watch } from 'vue'
  import { useRolePermissionsStore } from '../../stores/RolePermissionsStore'
  import Swal from 'sweetalert2'
  
  const props = defineProps({
    roleId: Number,
    roleName: String
  })
  
  const store = useRolePermissionsStore()
  
  onMounted(async () => {
    await store.fetchAllPermissions()
    await store.fetchAssignedPermissions(props.roleId)
  })
  
  watch(() => props.roleId, async (newId) => {
    if (newId) {
      await store.fetchAssignedPermissions(newId)
    }
  })
  
  const togglePermission = async (permission) => {
    const hasPermission = store.assignedPermissions.includes(permission)
  
    try {
      if (hasPermission) {
        await store.revokePermission(props.roleId, permission)
        Swal.fire('Permiso Revocado', `Se revocó "${permission}"`, 'success')
      } else {
        await store.assignPermission(props.roleId, permission)
        Swal.fire('Permiso Asignado', `Se asignó "${permission}"`, 'success')
      }
    } catch (err) {
      Swal.fire('Error', 'No se pudo cambiar el permiso', 'error')
    }
  }
  </script>
  