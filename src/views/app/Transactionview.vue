<template>
  <div class="max-w-3xl mx-auto p-6">
    <div
      class="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 transition duration-300"
    >
      <h2 class="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
        Registrar Transacción
      </h2>

      <form @submit.prevent="submit" class="space-y-6">
        <!-- Grupo: Caja y Creador -->
        <div class="grid md:grid-cols-2 gap-4">
          <FormInput
            v-model="form.cash_register_id"
            label="ID Caja"
            type="number"
            required
          />
          <FormInput
            v-model="form.created_by"
            label="ID Usuario (creador)"
            type="number"
            required
          />
        </div>

        <!-- Grupo: Tipo y Metal -->
        <div class="grid md:grid-cols-2 gap-4">
          <FormSelect
            v-model="form.type"
            label="Tipo"
            :options="['compra', 'venta']"
          />
          <FormSelect
            v-model="form.metal_type"
            label="Metal"
            :options="['oro', 'plata']"
          />
        </div>

        <!-- Grupo: Detalles -->
        <div class="grid md:grid-cols-3 gap-4">
          <FormInput
            v-model.number="form.grams"
            label="Gramos"
            type="number"
            step="0.01"
            required
          />
          <FormInput
            v-model.number="form.price_per_gram"
            label="Precio por gr (PEN)"
            type="number"
            step="0.01"
            required
          />
          <FormInput
            v-model.number="form.exchange_rate"
            label="T/C (S/)"
            type="number"
            step="0.0001"
            required
          />
        </div>

        <!-- Grupo: Totales -->
        <div class="grid md:grid-cols-2 gap-4">
          <FormInput
            v-model.number="form.total_pen"
            label="Total PEN"
            type="number"
            step="0.01"
            required
          />
          <FormInput
            v-model.number="form.total_usd"
            label="Total USD"
            type="number"
            step="0.01"
            required
          />
        </div>

        <!-- Acciones -->
        <div class="flex items-center gap-4 mt-4">
          <button
            type="submit"
            class="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            :disabled="loading"
          >
            {{ loading ? 'Registrando...' : 'Registrar' }}
          </button>

          <span v-if="success" class="text-green-600 dark:text-green-400 text-sm font-medium">
            {{ success }}
          </span>
          <span v-if="error" class="text-red-600 dark:text-red-400 text-sm font-medium">
            {{ error }}
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useTransactionsStore } from '../../stores/transactionStore'
import FormInput from '../../components/FormInput.vue'
import FormSelect from '../../components/FormSelect.vue'

const store = useTransactionsStore()
const loading = store.loading
const error = store.error
const success = store.success

const form = reactive({
  cash_register_id: '',
  type: 'compra',
  metal_type: 'oro',
  grams: '',
  price_per_gram: '',
  total_pen: '',
  total_usd: '',
  exchange_rate: '',
  created_by: '',
})

const submit = async () => {
  try {
    await store.createTransaction({ ...form })
    Object.keys(form).forEach((k) => (form[k] = ''))
  } catch {}
}
</script>
