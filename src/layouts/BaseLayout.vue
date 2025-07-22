<script setup>
import { ref } from 'vue'
import { useSidebarStore } from '../stores/sidebarStore'
import { useDark } from '@vueuse/core'
import {
  Menu,
  User,
  FileText,
  Briefcase,
  ShoppingBag,
  Gavel,
  Settings,
  ChevronDown,
  ChevronUp,
  Moon,
  Sun,
  LogOut
} from 'lucide-vue-next'

const sidebarStore = useSidebarStore()
const isDark = useDark()
const toggleDark = () => {
  isDark.value = !isDark.value
}

const modules = ref([
  {
    name: 'Usuarios',
    icon: User,
    to: '/user-management'
  },
  {
    name: 'Autorización',
    icon: FileText,
    open: false,
    options: [
      { name: 'Roles', icon: Briefcase, to: '/roles' },
      { name: 'Permisos', icon: FileText, to: '/permisos' }
    ]
  },
  {
    name: 'Lista Promociones',
    icon: ShoppingBag,
    to: '/products'
  },
  {
    name: 'Transaccion',
    icon: Gavel,
    to: '/transactions'
  },
  {
    name: 'Lista Transacciones',
    icon: Gavel,
    to: '/transaction-list'
  },
  
  {
    name: ' Apertura de caja',
    icon: Gavel,
    to: '/cash-register'
  }
])
</script>

<template>
  <div :class="['flex w-full h-screen overflow-hidden', isDark ? 'bg-gray-900 text-white' : 'bg-white text-black']">
    <!-- Sidebar -->
    <aside :class="[
      'flex flex-col justify-between h-full shadow-lg transition-all duration-300',
      sidebarStore.isOpen ? 'w-64' : 'w-20',
      isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'
    ]">
      <!-- Top section -->
      <div>
        <!-- Header -->
        <div class="flex items-center justify-between p-4 ml-2">
          <span v-if="sidebarStore.isOpen" class="text-xl font-bold">Logo</span>
          <button
            @click="sidebarStore.toggleSidebar()"
            class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <Menu size="20" />
          </button>
        </div>

        <!-- Configuración de perfil -->
        <!-- <div class="flex items-center space-x-2 p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
          <Settings size="20" />
          <span v-if="sidebarStore.isOpen">Config. Perfil</span>
        </div> -->

        <!-- Navigation -->
        <nav>
          <ul class="my-3">
            <li v-for="module in modules" :key="module.name" class="px-2 mt-3">
              <!-- Link directo -->
              <div v-if="module.to">
                <router-link
                  :to="module.to"
                  class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <component :is="module.icon" :size="sidebarStore.isOpen ? 20 : 18" />
                  <span v-if="sidebarStore.isOpen">{{ module.name }}</span>
                </router-link>
              </div>

              <!-- Con subopciones -->
              <div v-else>
                <button
                  @click="module.open = !module.open"
                  class="flex items-center justify-between w-full p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                >
                  <div class="flex items-center space-x-2">
                    <component :is="module.icon" :size="sidebarStore.isOpen ? 20 : 18" />
                    <span v-if="sidebarStore.isOpen">{{ module.name }}</span>
                  </div>
                  <ChevronUp v-if="module.open && sidebarStore.isOpen" size="16" />
                  <ChevronDown v-else-if="sidebarStore.isOpen" size="16" />
                </button>
                <ul v-if="module.open" class="ml-6">
                  <li v-for="option in module.options" :key="option.name">
                    <router-link
                      :to="option.to"
                      class="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
                    >
                      <component :is="option.icon" :size="sidebarStore.isOpen ? 16 : 14" />
                      <span v-if="sidebarStore.isOpen">{{ option.name }}</span>
                    </router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>

      <!-- Bottom: Logout -->
      <div class="p-4">
        <button
          class="flex items-center w-full space-x-2 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <LogOut size="20" />
          <span v-if="sidebarStore.isOpen">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-5 overflow-auto">
      <!-- Topbar with Dark mode toggle -->
      <div class="flex justify-end mb-4">
        <button @click="toggleDark()" class="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
          <Moon v-if="isDark" size="24" />
          <Sun v-else size="24" />
        </button>
      </div>

      <!-- Router view -->
      <div :class="isDark ? 'bg-gray-900 text-white' : 'bg-white text-black'">
        <router-view />
      </div>
    </main>
  </div>
</template>
