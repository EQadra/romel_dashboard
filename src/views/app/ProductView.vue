<template>
  <div class="container">
    <h2 class="title">Gestión de Productos</h2>

    <button @click="openCreate" class="btn-primary">Agregar producto</button>

    <div class="product-grid">
      <div v-for="product in products" :key="product.id" class="product-card">
        <img
          :src="getImageUrl(product.image_path)"
          class="product-image"
          v-if="product.image_path"
        />
        <div>
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-meta">Metal: {{ product.metal_type }}</p>
          <p class="product-meta">Gramos: {{ product.grams }}</p>
          <p class="product-meta">Pureza: {{ product.purity ?? '—' }}%</p>
          <p class="product-price">Precio x gr: ${{ product.price_per_gram }}</p>
        </div>

        <div class="card-actions">
          <button @click="edit(product)" class="link edit">Editar</button>
          <button @click="del(product.id)" class="link delete">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <Modal v-if="showModal" @close="closeModal" :title="editMode ? 'Editar' : 'Crear producto'">
      <form @submit.prevent="submit">
        <input v-model="form.name" placeholder="Nombre" required class="input" />
        <select v-model="form.metal_type" required class="input">
          <option value="">Seleccionar metal</option>
          <option value="oro">Oro</option>
          <option value="plata">Plata</option>
        </select>
        <input v-model.number="form.grams" type="number" min="0" step="0.01" placeholder="Gramos" class="input" required />
        <input v-model.number="form.purity" type="number" min="0" max="100" step="0.01" placeholder="Pureza (%)" class="input" />
        <input v-model.number="form.price_per_gram" type="number" min="0" step="0.01" placeholder="Precio x gr" class="input" />
        <input type="file" @change="onFileChange" class="input" />

        <img v-if="preview" :src="preview" class="image-preview" />

        <button class="btn-primary" type="submit">
          {{ editMode ? 'Actualizar' : 'Crear' }}
        </button>
      </form>
    </Modal>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useProductStore } from '../../stores/ProductsStore'
import { storeToRefs } from 'pinia'
import Modal from '../../components/Modal.vue'

const store = useProductStore()
const { products } = storeToRefs(store)

const showModal = ref(false)
const editMode = ref(false)
const selectedId = ref(null)
const preview = ref(null)

const form = ref({
  name: '',
  metal_type: '',
  grams: 0,
  purity: null,
  price_per_gram: 0,
  image: null,
})

function openCreate() {
  resetForm()
  showModal.value = true
  editMode.value = false
}

function edit(product) {
  resetForm()
  editMode.value = true
  selectedId.value = product.id
  Object.assign(form.value, { ...product })
  preview.value = product.image_path ? getImageUrl(product.image_path) : null
  showModal.value = true
}

function resetForm() {
  form.value = {
    name: '',
    metal_type: '',
    grams: 0,
    purity: null,
    price_per_gram: 0,
    image: null,
  }
  preview.value = null
  selectedId.value = null
}

function closeModal() {
  showModal.value = false
}

function getImageUrl(path) {
  return path ? `/storage/${path}` : ''
}

function onFileChange(e) {
  const file = e.target.files[0]
  form.value.image = file
  if (file) {
    preview.value = URL.createObjectURL(file)
  }
}

async function submit() {
  const fd = new FormData()
  for (const key in form.value) {
    if (form.value[key] !== null && form.value[key] !== '') {
      fd.append(key, form.value[key])
    }
  }

  if (editMode.value) {
    await store.update(selectedId.value, fd)
  } else {
    await store.create(fd)
  }
  closeModal()
}

async function del(id) {
  if (confirm('¿Eliminar producto?')) {
    await store.remove(id)
  }
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
.container {
  padding: 24px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
}

.btn-primary {
  background-color: #2563eb;
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 16px;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

.product-grid {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}

.product-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.product-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.product-name {
  font-size: 18px;
  font-weight: bold;
}

.product-meta {
  font-size: 14px;
  color: #4b5563;
}

.product-price {
  font-weight: bold;
  font-size: 14px;
  margin-top: 8px;
}

.card-actions {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  padding-top: 12px;
}

.link {
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  border: none;
  background: none;
  padding: 0;
}

.link.edit {
  color: #2563eb;
}

.link.delete {
  color: #dc2626;
}

.input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.image-preview {
  width: 160px;
  margin-top: 10px;
  border-radius: 8px;
}
</style>
