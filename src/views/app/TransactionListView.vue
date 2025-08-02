<template>
  <div class="max-w-6xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100 text-center">
      Transacciones del Día
    </h2>

    <!-- Card de Recarga -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col items-center justify-center mb-6"
    >
      <p class="text-gray-700 dark:text-gray-200 mb-3">
        Presiona el botón para actualizar la lista de transacciones.
      </p>
      <button
        @click="loadTransactions"
        class="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
        :disabled="loading"
      >
        <span v-if="!loading">🔄 Recargar</span>
        <span v-else>Cargando...</span>
      </button>
    </div>

    <!-- Estado de error -->
    <div v-if="error" class="text-red-500 mb-4 text-center">
      {{ error }}
    </div>

    <!-- Tabla de transacciones -->
    <EasyDataTable
      v-if="todayTransactions.length"
      :headers="headers"
      :items="formattedTransactions"
      :search-field="'type'"
      :rows-per-page="10"
      alternating
      buttons-pagination
      table-class="rounded-xl shadow"
    >
      <template #item-total_pen="{ total_pen }">
        S/ {{ Number(total_pen).toFixed(2) }}
      </template>
      <template #item-total_usd="{ total_usd }">
        $ {{ Number(total_usd).toFixed(2) }}
      </template>
      <template #item-created_at="{ created_at }">
        {{ new Date(created_at).toLocaleString() }}
      </template>
    </EasyDataTable>

    <div
      v-else-if="!loading"
      class="text-gray-500 dark:text-gray-400 text-center mt-6"
    >
      No hay transacciones registradas hoy.
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useTransactionsStore } from '../../stores/transactionsStore'
import EasyDataTable from 'vue3-easy-data-table'
import 'vue3-easy-data-table/dist/style.css'

const store = useTransactionsStore()
const { loading, error, todayTransactions } = storeToRefs(store)

const loadTransactions = () => {
  store.fetchTodayTransactions()
}

onMounted(() => {
  loadTransactions()
})

// Cabeceras para la tabla
const headers = [
  { text: '#', value: 'index' },
  { text: 'Tipo', value: 'type' },
  { text: 'Metal', value: 'metal_type' },
  { text: 'Gramos', value: 'grams' },
  { text: 'S/', value: 'total_pen' },
  { text: 'USD', value: 'total_usd' },
  { text: 'T/C', value: 'exchange_rate' },
  { text: 'Fecha', value: 'created_at' },
]

// Añadir índice a cada transacción
const formattedTransactions = computed(() =>
  todayTransactions.value.map((t, i) => ({
    ...t,
    index: i + 1,
  }))
)
</script>

<style scoped>
/* Puedes añadir más estilos personalizados aquí si deseas */
</style>
