<template>
  <div class="container">
    <h2 class="title">Caja del Día</h2>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-else-if="!cashRegister" class="card text-center">
      <p class="text-muted">No hay caja abierta hoy.</p>
      <button @click="showOpenModal = true" class="btn-primary mt-4">
        Abrir Caja
      </button>
    </div>

    <div v-else class="card">
      <div class="section">
        <h3 class="section-title">Detalles de apertura</h3>
        <p><strong>Fecha:</strong> {{ cashRegister.date }}</p>
        <p><strong>Efectivo inicial:</strong> ${{ cashRegister.opening_cash }}</p>
        <p><strong>Oro inicial:</strong> {{ cashRegister.opening_gold }}g</p>
        <p><strong>Plata inicial:</strong> {{ cashRegister.opening_silver }}g</p>
      </div>

      <div class="divider"></div>

      <div class="section">
        <h3 class="section-title">Estado</h3>
        <p v-if="cashRegister.closing_cash !== null">
          <strong>Cierre efectivo:</strong> ${{ cashRegister.closing_cash }}
        </p>
        <p v-else class="text-warning">Caja aún no cerrada.</p>
        <button
          v-if="cashRegister.closing_cash === null"
          @click="showCloseModal = true"
          class="btn-warning mt-4"
        >
          Cerrar Caja
        </button>
      </div>
    </div>

    <!-- Modal Abrir Caja -->
    <Modal v-if="showOpenModal" @close="showOpenModal = false" title="Abrir Caja">
      <form @submit.prevent="handleOpen" class="form">
        <input v-model="form.opening_cash" type="number" placeholder="Efectivo inicial" required class="input" />
        <input v-model="form.opening_gold" type="number" placeholder="Oro inicial (g)" required class="input" />
        <input v-model="form.opening_silver" type="number" placeholder="Plata inicial (g)" required class="input" />
        <button type="submit" class="btn-primary mt-2 w-full">Abrir</button>
      </form>
    </Modal>

    <!-- Modal Cerrar Caja -->
    <Modal v-if="showCloseModal" @close="showCloseModal = false" title="Cerrar Caja">
      <form @submit.prevent="handleClose" class="form">
        <input v-model="form.closing_cash" type="number" placeholder="Efectivo final" required class="input" />
        <input v-model="form.closing_gold" type="number" placeholder="Oro final (g)" required class="input" />
        <input v-model="form.closing_silver" type="number" placeholder="Plata final (g)" required class="input" />
        <button type="submit" class="btn-warning mt-2 w-full">Cerrar</button>
      </form>
    </Modal>
  </div>
</template>
<style scoped>
.container {
  padding: 2rem;
  max-width: 600px;
  margin: auto;
}

.title {
  font-size: 1.8rem;
  font-weight: 600;
  text-align: center;
  margin-bottom: 2rem;
  color: #111827;
}

.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.section {
  display: grid;
  gap: 0.5rem;
}

.section-title {
  font-size: 1.1rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 0.5rem;
}

.divider {
  border-top: 1px solid #e5e7eb;
  margin: 1rem 0;
}

.text-muted {
  color: #6b7280;
}

.text-warning {
  color: #f59e0b;
}

/* Botones */
.btn-primary,
.btn-warning {
  color: #ffffff;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.btn-primary {
  background-color: #3b82f6;
}
.btn-primary:hover {
  background-color: #2563eb;
}

.btn-warning {
  background-color: #f59e0b;
}
.btn-warning:hover {
  background-color: #d97706;
}

/* Formularios */
.form {
  display: grid;
  gap: 0.75rem;
}

.input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.2s ease;
}
.input:focus {
  outline: none;
  border-color: #3b82f6;
}

.mt-2 {
  margin-top: 0.5rem;
}
.mt-4 {
  margin-top: 1rem;
}
.w-full {
  width: 100%;
}
.text-center {
  text-align: center;
}
</style>
