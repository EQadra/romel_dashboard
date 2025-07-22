import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/AuthStore' // 👈 Asegúrate de importar el store

// Layout principal
import BaseLayout from '../layouts/BaseLayout.vue'

// Auth
import LoginView from '../views/auth/LoginView.vue'
import RegisterView from '../views/auth/RegisterView.vue'
import ForgotPasswordView from '../views/auth/ForgotPasswordView.vue'
import ResetPasswordView from '../views/auth/ResetPasswordView.vue'
import VerifyAccountView from '../views/auth/VerifyAccountView.vue'
import NotFoundView from '../views/auth/NotFoundView.vue'

// Administración (Roles & Permisos)
import RolesView from '../views/auto/RolesView.vue'
import PermissionsView from '../views/auto/PermissionsView.vue'
import RolePermissionView from '../views/auto/RolePermissionView.vue'

// Vistas de aplicación
import HomeView from '../views/app/HomeView.vue'
import UserManagement from '../views/app/UserManagement.vue'
import TransactionView from '../views/app/TransactionView.vue'
import TransactionListView from '../views/app/TransactionListView.vue'
import ProductView from '../views/app/ProductView.vue'
import CashRegisterView from '../views/app/CashRegisterView.vue'

const routes = [
  // 🌐 Auth públicas
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  { path: '/register', component: RegisterView },
  { path: '/forgot-password', component: ForgotPasswordView },
  { path: '/reset-password/:token', component: ResetPasswordView },
  { path: '/verify-account', component: VerifyAccountView },

  // 🛡️ Vistas protegidas
  {
    path: '/dashboard',
    component: BaseLayout,
    children: [
      { path: '', name: 'Dashboard', component: HomeView,  },
      { path: '/transactions', name: 'Transactions', component: TransactionView,  },
      { path: '/transaction-list', name: 'TransactionList', component: TransactionListView,  },
      { path: '/products', name: 'Products', component: ProductView,  },
      { path: '/cash-register', name: 'CashRegister', component: CashRegisterView,  },
      { path: '/user-management', name: 'UserManagement', component: UserManagement,  },
    ]
  },

  // 🔐 Administración (también protegidas)
  {
    path: '/admin',
    component: BaseLayout,
    children: [
      { path: '/roles', name: 'Roles', component: RolesView,  },
      { path: '/permisos', name: 'Permissions', component: PermissionsView,  },
      { path: '/roles-permisos', name: 'RolePermission', component: RolePermissionView,  }
    ]
  },

  // ❌ 404
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 🛡️ Protección global de rutas
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.token) {
    return next({ name: 'NotFound', query: { reason: 'unauthenticated' } })
  }
  

  next()
})

export default router
