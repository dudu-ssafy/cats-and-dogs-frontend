import { createRouter, createWebHistory } from 'vue-router'
import MainPage from '../views/MainPage.vue'
import ShopView from '../views/ShopView.vue' 
import ProductDetail from '@/views/ProductDetail.vue'
import CartView from '@/views/CartView.vue'
import AiDiagnosisView from '@/views/AiDiagnosisView.vue'
import CommunityView from '@/views/CommunityView.vue'
import CommunityWrite from '@/views/CommunityWrite.vue'
import CommunityDetail from '@/views/CommunityDetail.vue'
import ShortsView from '@/views/ShortsView.vue' // ✅ 추가

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainPage
    },
    {
      path: '/shop',     
      name: 'shop',
      component: ShopView 
    },
    { 
      path: '/shop/:id', 
      name: 'product-detail', 
      component: ProductDetail 
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartView // 👈 '/cart'로 오면 장바구니 보여줘!
    },
    {
      path: '/ai',
      name: 'ai-diagnosis',
      component: AiDiagnosisView
    },
    {
      path: '/community',
      name: 'community',
      component: CommunityView
    },
    {
      path: '/community/write',
      name: 'community-write',
      component: CommunityWrite
    },
    {
      path: '/community/post/:id',
      name: 'community-detail',
      component: CommunityDetail
    },
    {
      path: '/shorts',
      name: 'shorts',
      component: ShortsView

    }

  ]
})

export default router