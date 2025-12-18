<script setup>
import { computed, ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const router = useRouter(); 
const store = useCartStore();
const userStore = useUserStore();

const isAiPage = computed(() => route.path === '/ai');
const showCartIcon = computed(() => route.path.includes('/shop'));
const isHeaderVisible = ref(false);

// 배지 애니메이션을 위한 상태
const isPop = ref(false);

onMounted(() => {
    userStore.initUser();
});

// ✅ 장바구니 숫자가 변할 때마다 톡톡 튀는 효과 추가
watch(() => store.cartCount, () => {
    isPop.value = true;
    setTimeout(() => { isPop.value = false; }, 300);
});

const goToProfileOrLogin = () => {
    if (userStore.isLogin) {
        router.push('/my-profile');
    } else {
        router.push('/login');
    }
};
</script>

<template>
  <div v-if="isAiPage" class="hover-trigger" @mouseenter="isHeaderVisible = true"></div>

  <header 
    class="c-site-header" 
    :class="{ 'is-ai-mode': isAiPage, 'is-visible': !isAiPage || isHeaderVisible }" 
    @mouseenter="isHeaderVisible = true" 
    @mouseleave="isHeaderVisible = false"
  >
    <div class="l-header-inner l-container">
      <router-link to="/" class="c-logo o-flex-center">
        <span class="material-icons-round c-logo__icon">pets</span>
        <span class="c-logo__text u-fw-bold">함께하개<span class="c-logo__highlight">냥</span></span>
      </router-link>

      <nav class="c-nav">
        <ul class="l-nav-list o-flex-center">
          <li><router-link to="/ai" class="c-nav-item u-fw-bold">AI 진단</router-link></li>
          <li><router-link to="/shorts" class="c-nav-item u-fw-bold">쇼츠</router-link></li>
          <li><router-link to="/community" class="c-nav-item u-fw-bold">커뮤니티</router-link></li>
          <li><router-link to="/shop" class="c-nav-item u-fw-bold">상점</router-link></li>
        </ul>
      </nav>

      <div class="l-header-right o-flex-center">
        <router-link to="/cart" class="c-cart-btn" v-if="userStore.isLogin && showCartIcon">
            <span class="material-icons-round c-cart-btn__icon">shopping_cart</span>
            <span 
              class="c-badge u-animate-pop" 
              v-if="store.cartCount > 0"
              :class="{ 'is-active': isPop }"
            >
              {{ store.cartCount }}
            </span>
        </router-link>

        <template v-if="!userStore.isLogin">
             <router-link to="/login" class="c-btn c-btn--primary-round u-fw-bold">로그인</router-link>
        </template>
        
        <template v-else>
            <button class="c-btn-logout u-fw-bold" @click="userStore.logout">로그아웃</button>
            <button class="c-btn-icon" @click="goToProfileOrLogin">
                <span class="material-icons-round">person</span>
            </button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ============================================================
   1. Objects (Layout: l-, o-)
   ============================================================ */
.o-flex-center { display: flex; align-items: center; }
.l-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
.l-header-inner { height: 100%; display: flex; align-items: center; justify-content: space-between; }
.l-nav-list { gap: 45px; list-style: none; margin: 0; padding: 0; }
.l-header-right { gap: 18px; flex-shrink: 0; }

/* ============================================================
   2. Components (Skin: c-)
   ============================================================ */
.c-site-header {
  --h-height: 80px;
  --h-bg: rgba(255, 255, 255, 0.95);
  --h-primary: #FFD54F; /* 메인 노랑 */
  --h-accent: #FF8F00;  /* 강조 오렌지 */
  
  width: 100%; height: var(--h-height);
  background-color: var(--h-bg);
  backdrop-filter: blur(10px);
  position: sticky; top: 0; z-index: 1000;
  box-shadow: 0 1px 10px rgba(0,0,0,0.03);
  transition: transform 0.3s ease;
}

/* AI Mode & Visibility */
.is-ai-mode { position: fixed; transform: translateY(-100%); }
.is-visible { transform: translateY(0); }
.hover-trigger { position: fixed; top: 0; width: 100%; height: 20px; z-index: 2000; }

/* Logo */
.c-logo { text-decoration: none; color: #4A3F35; gap: 8px; }
.c-logo__icon { color: var(--h-primary); font-size: 32px; }
.c-logo__text { font-size: 28px; }
.c-logo__highlight { color: var(--h-primary); }

/* Navigation */
.c-nav-item { 
    font-size: 20px; color: #4A3F35; text-decoration: none; 
    padding: 8px 0; position: relative; transition: color 0.2s;
}
.c-nav-item:hover, .router-link-active.c-nav-item { color: #2D241E; }
.router-link-active.c-nav-item::after { 
    content: ''; position: absolute; bottom: -4px; left: 50%; 
    transform: translateX(-50%); width: 6px; height: 6px; 
    background-color: var(--h-primary); border-radius: 50%; 
}

/* 🛒 Cart Button & Badge (핵심 변경 부분) */
.c-cart-btn { 
    position: relative; 
    display: flex; align-items: center; justify-content: center;
    color: #4A3F35; text-decoration: none; 
}
.c-cart-btn__icon { font-size: 30px; transition: color 0.2s; }
.c-cart-btn:hover .c-cart-btn__icon { color: var(--h-accent); }

.c-badge {
    position: absolute;
    top: -4px; right: -8px;
    background: var(--h-accent); /* 홈페이지 분위기에 맞는 딥한 오렌지/옐로우 */
    color: white;
    font-size: 11px; font-weight: 800;
    min-width: 18px; height: 18px;
    padding: 0 4px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid white; /* 아이콘과 겹쳐도 잘 보이게 하는 킥! */
    box-shadow: 0 2px 6px rgba(255, 143, 0, 0.3);
    pointer-events: none;
    z-index: 1;
}

/* Buttons */
.c-btn { border: none; cursor: pointer; text-decoration: none; transition: 0.2s; }
.c-btn--primary-round {
    background: var(--h-primary); color: #4A3F35; 
    padding: 8px 18px; border-radius: 20px;
    box-shadow: 0 4px 8px rgba(255, 213, 79, 0.3);
}
.c-btn-icon {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--h-primary); color: #4A3F35; border: none;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 8px rgba(255, 213, 79, 0.3);
}
.c-btn-logout { background: none; border: none; color: #999; cursor: pointer; }

/* ============================================================
   3. Utilities & Animations (u-)
   ============================================================ */
.u-fw-bold { font-weight: 700; }

/* 숫자가 바뀔 때 톡톡 튀는 애니메이션 */
@keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.4); }
    100% { transform: scale(1); }
}
.c-badge.is-active {
    animation: pop 0.3s ease-out;
}
</style>