<template>
  <div :style="{ backgroundColor: darkMode ? '#000' : '#cce4ff', color: darkMode ? '#fff' : '#000', padding: '16px', minHeight: '100vh' }">
    <h1 style="text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 16px;">Calculadora de Oro</h1>

    <!-- Inputs -->
    <div style="max-width: 500px; margin: 0 auto;">
      <div v-for="(label, key) in fieldLabels" :key="key" style="margin-bottom: 12px;">
        <label :for="key" style="display: block; margin-bottom: 4px;">{{ label }}</label>
        <input
          :id="key"
          v-model="inputs[key]"
          type="number"
          :placeholder="placeholders[key]"
          style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;"
        />
      </div>
    </div>

    <!-- Botones -->
    <div style="display: flex; justify-content: space-around; margin-top: 20px;">
      <button @click="clearAll" style="padding: 10px 16px; background-color: #d9534f; color: white; border: none; border-radius: 4px;">Limpiar</button>
      <button @click="showModal = true" style="padding: 10px 16px; background-color: #0275d8; color: white; border: none; border-radius: 4px;">Ver Recibo</button>
    </div>

    <!-- Modal -->
    <div v-if="showModal" style="position: fixed; inset: 0; background-color: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;">
      <div :style="{ backgroundColor: darkMode ? '#111' : 'white', padding: '24px', borderRadius: '10px', width: '90%', maxWidth: '400px' }">
        <h2 style="text-align: center; font-size: 18px; font-weight: bold;">Recibo de Cálculo</h2>
        <p style="text-align: center; font-size: 12px; color: gray;">BMG Electronics</p>
        <p style="text-align: center; font-size: 12px; color: gray;">Av Rafael Escardó 1143, San Miguel</p>
        <p style="text-align: center; font-size: 12px; color: gray;">Número de Contacto: 912 184 269</p>

        <div style="margin-top: 12px;">
          <p>💰 Precio x gramo (USD): <strong>${{ format(pricePerGramUSD) }}</strong></p>
          <p>💰 Precio x gramo (PEN): <strong>S/ {{ format(pricePerGramPEN) }}</strong></p>
          <p>⚖️ Gramos: <strong>{{ format(inputs.grams) }} g</strong></p>
          <p>💵 Total USD: <strong>${{ format(totalUSD) }}</strong></p>
          <p>💵 Total PEN: <strong>S/ {{ format(totalPEN) }}</strong></p>
        </div>

        <div style="display: flex; justify-content: space-between; margin-top: 16px;">
          <button @click="showModal = false" style="padding: 10px 16px; background-color: #555; color: white; border: none; border-radius: 4px;">Cerrar</button>
          <button @click="printReceipt" style="padding: 10px 16px; background-color: #83a4d4; color: black; border: none; border-radius: 4px;">Imprimir</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'

const props = defineProps({ darkMode: Boolean })

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
</script>
