<template>
  <div class="container">
    <h2 class="title">Caja del día</h2>

    <div v-if="loading">Cargando...</div>

    <div v-else-if="!cashRegister">
      <p>No hay caja abierta hoy.</p>
      <button @click="showOpenModal = true" class="btn-primary">
        Abrir caja
      </button>
    </div>

    <div v-else>
      <div class="info-box">
        <p><strong>Fecha:</strong> {{ cashRegister.date }}</p>
        <p><strong>Inicio efectivo:</strong> ${{ cashRegister.opening_cash }}</p>
        <p><strong>Inicio oro:</strong> {{ cashRegister.opening_gold }}g</p>
        <p><strong>Inicio plata:</strong> {{ cashRegister.opening_silver }}g</p>
        <p v-if="cashRegister.closing_cash !== null">
          <strong>Cierre efectivo:</strong> ${{ cashRegister.closing_cash }}
        </p>
        <p v-else class="text-danger">Caja aún no cerrada.</p>
      </div>

      <button
        v-if="cashRegister.closing_cash === null"
        @click="showCloseModal = true"
        class="btn-warning mt-4"
      >
        Cerrar caja
      </button>
    </div>

    <!-- Abrir Caja Modal -->
    <Modal
      v-if="showOpenModal"
      @close="showOpenModal = false"
      title="Abrir Caja"
    >
      <form @submit.prevent="handleOpen">
        <input
          v-model="form.opening_cash"
          type="number"
          placeholder="Efectivo inicial"
          required
          class="input"
        />
        <input
          v-model="form.opening_gold"
          type="number"
          placeholder="Oro inicial (g)"
          required
          class="input"
        />
        <input
          v-model="form.opening_silver"
          type="number"
          placeholder="Plata inicial (g)"
          required
          class="input"
        />
        <button type="submit" class="btn-primary mt-2">Abrir</button>
      </form>
    </Modal>

    <!-- Cerrar Caja Modal -->
    <Modal
      v-if="showCloseModal"
      @close="showCloseModal = false"
      title="Cerrar Caja"
    >
      <form @submit.prevent="handleClose">
        <input
          v-model="form.closing_cash"
          type="number"
          placeholder="Efectivo final"
          required
          class="input"
        />
        <input
          v-model="form.closing_gold"
          type="number"
          placeholder="Oro final (g)"
          required
          class="input"
        />
        <input
          v-model="form.closing_silver"
          type="number"
          placeholder="Plata final (g)"
          required
          class="input"
        />
        <button type="submit" class="btn-warning mt-2">Cerrar</button>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useCashRegisterStore } from '../../stores/CashRegisterStore'
import Modal from '../../components/Modal.vue'

const store = useCashRegisterStore()
const { cashRegister, loading } = storeToRefs(store)

const form = ref({
  opening_cash: '',
  opening_gold: '',
  opening_silver: '',
  closing_cash: '',
  closing_gold: '',
  closing_silver: '',
})

const showOpenModal = ref(false)
const showCloseModal = ref(false)

const handleOpen = async () => {
  try {
    await store.openCash(form.value)
    showOpenModal.value = false
  } catch (e) {
    alert(e)
  }
}

const handleClose = async () => {
  try {
    await store.closeCash(form.value)
    showCloseModal.value = false
  } catch (e) {
    alert(e)
  }
}

onMounted(() => {
  store.fetchToday()
})
</script>

<style scoped>
/* Contenedor principal */
.container {
  padding: 1.5rem;
  max-width: 42rem;
  margin: 0 auto;
}

/* Título */
.title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1rem;
}

/* Caja de información */
.info-box {
  background-color: #f3f4f6;          /* gris claro */
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: grid;
  gap: 0.5rem;                        /* emula space‑y‑2 */
}

/* Texto rojo para alertas */
.text-danger {
  color: #ef4444;                     /* rojo */
}

/* Botones */
.btn-primary,
.btn-warning {
  color: #ffffff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-primary {
  background-color: #2563eb;          /* azul */
}
.btn-primary:hover {
  background-color: #1d4ed8;
}
.btn-warning {
  background-color: #f59e0b;          /* amarillo */
}
.btn-warning:hover {
  background-color: #d97706;
}

/* Formularios */
.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  margin-bottom: 0.5rem;
  box-sizing: border-box;
}

/* Utilidades pequeñas */
.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
</style>
