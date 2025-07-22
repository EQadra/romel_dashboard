<template>
  <div class="max-w-5xl mx-auto p-6">
    <h2 class="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
      Transacciones del Día
    </h2>

    <button
      @click="loadTransactions"
      class="bg-blue-600 text-white px-4 py-2 mb-4 rounded hover:bg-blue-700"
    >
      Recargar
    </button>

    <div v-if="loading" class="text-gray-600 dark:text-gray-300">Cargando...</div>

    <div v-if="error" class="text-red-500">{{ error }}</div>

    <table
      v-if="todayTransactions.length"
      class="min-w-full bg-white dark:bg-gray-900 rounded-xl shadow overflow-hidden"
    >
      <thead class="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200">
        <tr>
          <th class="text-left px-4 py-2">#</th>
          <th class="text-left px-4 py-2">Tipo</th>
          <th class="text-left px-4 py-2">Metal</th>
          <th class="text-left px-4 py-2">Gramos</th>
          <th class="text-left px-4 py-2">S/</th>
          <th class="text-left px-4 py-2">USD</th>
          <th class="text-left px-4 py-2">T/C</th>
          <th class="text-left px-4 py-2">Fecha</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(t, i) in todayTransactions"
          :key="t.id"
          class="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <td class="px-4 py-2">{{ i + 1 }}</td>
          <td class="px-4 py-2 capitalize">{{ t.type }}</td>
          <td class="px-4 py-2 capitalize">{{ t.metal_type }}</td>
          <td class="px-4 py-2">{{ t.grams }}</td>
          <td class="px-4 py-2">S/ {{ t.total_pen }}</td>
          <td class="px-4 py-2">$ {{ t.total_usd }}</td>
          <td class="px-4 py-2">{{ t.exchange_rate }}</td>
          <td class="px-4 py-2">{{ new Date(t.created_at).toLocaleString() }}</td>
        </tr>
      </tbody>
    </table>

    <div v-else-if="!loading" class="text-gray-500 dark:text-gray-400">
      No hay transacciones registradas hoy.
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useTransactionsStore } from '../../stores/transactionStore'
import { storeToRefs } from 'pinia'

const store = useTransactionsStore()
const { loading, error, todayTransactions } = storeToRefs(store)

const loadTransactions = () => {
  store.fetchTodayTransactions()
}

onMounted(() => {
  loadTransactions()
})
</script>
