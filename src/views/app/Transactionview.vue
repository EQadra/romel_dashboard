<template>
  <div
    :style="{
      backgroundColor: darkMode ? '#000' : '#f4f6f8',
      color: darkMode ? '#fff' : '#333',
      padding: '32px 16px',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
    }"
  >
    <div
      style="max-width: 600px; margin: 0 auto; background: white; padding: 24px; border-radius: 16px; box-shadow: 0 8px 20px rgba(0,0,0,0.06);"
      :style="{ backgroundColor: darkMode ? '#111' : '#fff' }"
    >
      <!-- Encabezado con ícono SVG -->
      <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 24px; gap: 6px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
          <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
          <line x1="8" y1="6" x2="16" y2="6" />
          <line x1="8" y1="10" x2="16" y2="10" />
          <line x1="8" y1="14" x2="16" y2="14" />
          <line x1="8" y1="18" x2="16" y2="18" />
        </svg>
        <h1 style="font-size: 20px; font-weight: 600; line-height: 1; margin: 0;">
          Calculadora de Oro
        </h1>
      </div>

      <!-- Inputs -->
      <div>
        <div
          v-for="(label, key) in fieldLabels"
          :key="key"
          style="margin-bottom: 16px;"
        >
          <label :for="key" style="display: block; margin-bottom: 6px; font-weight: 500;">
            {{ label }}
          </label>
          <input
            :id="key"
            v-model="inputs[key]"
            type="number"
            :placeholder="placeholders[key]"
            style="width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;"
          />
        </div>
      </div>

      <!-- Resumen -->
      <div
        style="margin-top: 24px; padding: 16px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);"
        :style="{ backgroundColor: darkMode ? '#1e1e1e' : '#f9f9f9', color: darkMode ? '#fff' : '#333' }"
      >
        <h3 style="margin-bottom: 12px; font-size: 16px; font-weight: 600;">Resumen en Tiempo Real</h3>
        <p>💰 Precio por gramo (USD): <strong>${{ format(pricePerGramUSD) }}</strong></p>
        <p>💰 Precio por gramo (PEN): <strong>S/ {{ format(pricePerGramPEN) }}</strong></p>
        <p>⚖️ Gramos ingresados: <strong>{{ format(inputs.grams) }} g</strong></p>
      </div>

      <!-- Botones -->
      <div style="display: flex; justify-content: space-between; margin-top: 24px;">
        <button
          @click="clearAll"
          style="flex: 1; margin-right: 8px; padding: 10px 0; background-color: #ff6b6b; color: white; border: none; border-radius: 8px; font-weight: 500;"
        >
          Limpiar
        </button>
        <button
          @click="showModal = true"
          style="flex: 1; margin-left: 8px; padding: 10px 0; background-color: #1e88e5; color: white; border: none; border-radius: 8px; font-weight: 500;"
        >
          Ver Recibo
        </button>
      </div>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      style="position: fixed; inset: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;"
    >
      <div
        :style="{
          backgroundColor: darkMode ? '#1a1a1a' : '#ffffff',
          padding: '28px',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
        }"
      >
        <h2 style="text-align: center; font-size: 20px; font-weight: 600;">
          🧾 Recibo de Cálculo
        </h2>
        <p style="text-align: center; font-size: 12px; color: gray;">BMG Electronics</p>
        <p style="text-align: center; font-size: 12px; color: gray;">Av Rafael Escardó 1143, San Miguel</p>
        <p style="text-align: center; font-size: 12px; color: gray;">Número de Contacto: 912 184 269</p>

        <div style="margin-top: 16px; font-size: 14px;">
          <p>💰 Precio x gramo (USD): <strong>${{ format(pricePerGramUSD) }}</strong></p>
          <p>💰 Precio x gramo (PEN): <strong>S/ {{ format(pricePerGramPEN) }}</strong></p>
          <p>⚖️ Gramos: <strong>{{ format(inputs.grams) }} g</strong></p>
          <p>💵 Total USD: <strong>${{ format(totalUSD) }}</strong></p>
          <p>💵 Total PEN: <strong>S/ {{ format(totalPEN) }}</strong></p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 20px;">
          <button
            @click="showModal = false"
            style="flex: 1; margin-right: 8px; padding: 10px 0; background-color: #ccc; color: #000; border: none; border-radius: 8px;"
          >
            Cerrar
          </button>
          <button
            @click="handleSaveAndPrint"
            style="flex: 1; margin-left: 8px; padding: 10px 0; background-color: #aed581; color: #1b1b1b; border: none; border-radius: 8px;"
          >
            Imprimir
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'
import { useTransactionsStore } from '../../stores/TransactionsStore'

const props = defineProps({ darkMode: Boolean })
const store = useTransactionsStore()

const showModal = ref(false)

const inputs = reactive({
  pricePerOz: '',
  exchangeRate: '',
  purity: '',
  discountPercentage: '',
  grams: '',
})

const fieldLabels = {
  pricePerOz: 'Precio de la onza (USD)',
  exchangeRate: 'Tipo de cambio (USD a PEN)',
  purity: 'Ley del oro (pureza)',
  discountPercentage: '% de descuento',
  grams: 'Cantidad de gramos a calcular',
}

const placeholders = {
  pricePerOz: 'Ej: 1980.45',
  exchangeRate: 'Ej: 3.75',
  purity: 'Ej: 0.75',
  discountPercentage: 'Ej: 5',
  grams: 'Ej: 10',
}

const parse = (val) => parseFloat(val) || 0
const format = (n) => Number(n).toFixed(2)

const pricePerGramUSD = computed(() => {
  const price = parse(inputs.pricePerOz) / 31.1035
  const pure = price * parse(inputs.purity)
  const discount = pure * (parse(inputs.discountPercentage) / 100)
  return pure - discount
})

const pricePerGramPEN = computed(() => pricePerGramUSD.value * parse(inputs.exchangeRate))
const totalUSD = computed(() => pricePerGramUSD.value * parse(inputs.grams))
const totalPEN = computed(() => pricePerGramPEN.value * parse(inputs.grams))

const clearAll = () => {
  for (const key in inputs) inputs[key] = ''
}

const printReceipt = () => {
  window.print()
}

const handleSaveAndPrint = async () => {
  const payload = {
    price_per_oz: parse(inputs.pricePerOz),
    exchange_rate: parse(inputs.exchangeRate),
    purity: parse(inputs.purity),
    discount_percentage: parse(inputs.discountPercentage),
    grams: parse(inputs.grams),
    price_per_gram_usd: pricePerGramUSD.value,
    price_per_gram_pen: pricePerGramPEN.value,
    total_usd: totalUSD.value,
    total_pen: totalPEN.value,
  }

  try {
    await store.saveGoldCalculation(payload)
    printReceipt()
  } catch (e) {
    alert('❌ No se pudo guardar el cálculo. Intenta nuevamente.')
  }
}
</script>
