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
import LoginView from '@/views/LoginView.vue'     // 🔥 추가
import SignupView from '@/views/SignupView.vue'
import MyProfileView from '@/views/MyProfileView.vue' 
import ShopOrder from '@/views/ShopOrder.vue'
import LicensePage  from '@/views/LicensePage.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  scrollBehavior() {
    return { top: 0 }
  },


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
    path: '/shop/order',
    name: 'ShopOrder',
    component: ShopOrder
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

    },
    {
      path: '/login',      // 🔥 추가
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',     // 🔥 추가
      name: 'signup',
      component: SignupView
    },
    {
      path: '/my-profile', // 🔥 추가
      name: 'myProfile',
      component: MyProfileView
    },
    {
      path: '/ai-diagnosis',
      name: 'AiDiagnosis', // 👈 여기 name이 'AiDiagnosis' 여야 합니다!
      component: () => import('../views/AiDiagnosisView.vue')

    },
    {
      path: '/my-page/license', 
      name: 'license',
      component: LicensePage
    }



  ]
})

export default router