<template>
    <div :class="darkMode ? 'bg-black text-white' : 'bg-blue-100'" class="min-h-screen p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Calculadora de Oro</h1>
  
      <!-- Inputs -->
      <div class="grid gap-4 md:grid-cols-2 max-w-2xl mx-auto">
        <div v-for="(field, key) in fieldLabels" :key="key">
          <label :class="{ 'text-white': darkMode, 'text-gray-700': !darkMode }" class="block text-sm font-medium mb-1">
            {{ field }}
          </label>
          <input
            v-model="inputs[key]"
            type="text"
            :placeholder="placeholders[key]"
            class="w-full border rounded p-2 text-sm bg-white dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>
  
      <!-- Botones -->
      <div class="flex justify-center gap-4 mt-6">
        <button @click="clearAll" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Limpiar</button>
        <button @click="showModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Ver Recibo</button>
      </div>
  
      <!-- Modal -->
      <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div :class="darkMode ? 'bg-gray-900' : 'bg-white'" class="rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 class="text-lg font-bold text-center mb-2">Recibo de Cálculo</h2>
          <p class="text-center text-sm text-gray-500">BMG Electronics</p>
          <p class="text-center text-sm text-gray-500">Av Rafael Escardó 1143, San Miguel</p>
          <p class="text-center text-sm text-gray-500 mb-4">Número de Contacto: 912 184 269</p>
  
          <div class="text-sm space-y-2">
            <p>💰 Precio x gramo (USD): <strong>${{ format(pricePerGramUSD) }}</strong></p>
            <p>💰 Precio x gramo (PEN): <strong>S/ {{ format(pricePerGramPEN) }}</strong></p>
            <p>⚖️ Gramos: <strong>{{ format(inputs.grams) }} g</strong></p>
            <p>💵 Total USD: <strong>${{ format(totalUSD) }}</strong></p>
            <p>💵 Total PEN: <strong>S/ {{ format(totalPEN) }}</strong></p>
          </div>
  
          <div class="flex justify-between mt-6">
            <button @click="showModal = false" class="bg-gray-600 text-white px-4 py-2 rounded">Cerrar</button>
            <button @click="printReceipt" class="bg-blue-300 text-black px-4 py-2 rounded">Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, computed, ref } from 'vue'
  
  // Puedes pasar darkMode como prop si lo usas desde otro lugar
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
  
  <style scoped>
  @media print {
    body * {
      visibility: hidden;
    }
  
    .z-50, .z-50 * {
      visibility: visible;
    }
  
    .z-50 {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  </style>
  