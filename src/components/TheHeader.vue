<script setup>
/* 기존 스크립트 로직 유지 (수정 없음) */
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
const isPop = ref(false);

onMounted(() => { userStore.initUser(); });

watch(() => store.cartCount, () => {
    isPop.value = true;
    setTimeout(() => { isPop.value = false; }, 300);
});

const goToProfileOrLogin = () => {
    if (userStore.isLogin) router.push('/my-profile');
    else router.push('/login');
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
            <span class="c-badge u-animate-pop" v-if="store.cartCount > 0" :class="{ 'is-active': isPop }">
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
.l-container { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 clamp(10px, 2vw, 20px); 
}
.l-header-inner { 
    height: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
    gap: clamp(10px, 2vw, 30px); 
}
.l-nav-list { 
    display: flex;
    list-style: none; 
    margin: 0; 
    padding: 0; 
    gap: clamp(12px, 3.5vw, 45px); 
}
.l-header-right { 
    gap: clamp(8px, 1.5vw, 18px); 
    flex-shrink: 0; 
}

/* ============================================================
   2. Components (Skin: c-)
   ============================================================ */
.c-site-header {
  --h-height: clamp(60px, 8vh, 80px); 
  --h-bg: rgba(255, 255, 255, 0.95);
  --h-primary: #FFD54F;
  --h-accent: #FF8F00;
  
  width: 100%; height: var(--h-height);
  background-color: var(--h-bg);
  backdrop-filter: blur(10px);
  position: sticky; top: 0; z-index: 1000;
  box-shadow: 0 1px 10px rgba(0,0,0,0.03);
  transition: transform 0.3s ease;
}

.is-ai-mode { position: fixed; transform: translateY(-100%); }
.is-visible { transform: translateY(0); }
.hover-trigger { position: fixed; top: 0; width: 100%; height: 20px; z-index: 2000; }

.c-logo { 
    text-decoration: none; 
    color: #4A3F35; 
    gap: 8px; 
    flex-shrink: 0; 
}
.c-logo__icon { color: var(--h-primary); font-size: clamp(24px, 3vw, 32px); }
.c-logo__text { 
    font-size: clamp(18px, 2.5vw, 28px); 
    white-space: nowrap; 
}
.c-logo__highlight { color: var(--h-primary); }

.c-nav-item { 
    font-size: clamp(14px, 1.8vw, 20px); 
    color: #4A3F35; 
    text-decoration: none; 
    padding: 8px 0; 
    position: relative; 
    white-space: nowrap; 
}
.router-link-active.c-nav-item::after { 
    content: ''; position: absolute; bottom: -4px; left: 50%; 
    transform: translateX(-50%); width: clamp(4px, 0.5vw, 6px); height: clamp(4px, 0.5vw, 6px); 
    background-color: var(--h-primary); border-radius: 50%; 
}

.c-cart-btn { position: relative; color: #4A3F35; flex-shrink: 0; }
.c-cart-btn__icon { font-size: clamp(24px, 2.5vw, 30px); }

.c-badge {
    position: absolute; top: -4px; right: -8px;
    background: var(--h-accent); color: white;
    font-size: 10px; font-weight: 800;
    min-width: 18px; height: 18px; padding: 0 4px;
    border-radius: 10px; border: 2px solid white;
    display: flex; align-items: center; justify-content: center;
}

/* --- 공통 버튼 스타일 (선 제거 핵심) --- */
.c-btn { 
    border: none; 
    outline: none;     /* 클릭 시 검은 선 방지 */
    cursor: pointer; 
    text-decoration: none; 
    white-space: nowrap; 
    background: none;
}

.c-btn--primary-round {
    background: var(--h-primary); color: #4A3F35; 
    padding: clamp(6px, 1vw, 8px) clamp(12px, 1.5vw, 18px); 
    border-radius: 20px; font-size: clamp(13px, 1.4vw, 16px);
}

.c-btn-icon {
    width: clamp(34px, 4vw, 40px); height: clamp(34px, 4vw, 40px);
    border-radius: 50%; background: var(--h-primary);
    display: flex; align-items: center; justify-content: center; 
    flex-shrink: 0;
    border: none;      /* 선 제거 */
    outline: none;     /* 선 제거 */
}

.c-btn-logout { 
    background: none; 
    border: none;      /* 선 제거 */
    outline: none;     /* 선 제거 */
    color: #999; 
    font-size: clamp(13px, 1.4vw, 16px);
    cursor: pointer;
    padding: 0;
}
.c-btn-logout:hover { color: #FF5252; }

/* --- 3. Utilities & Animations --- */
.u-fw-bold { font-weight: 700; }
@keyframes pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.4); }
    100% { transform: scale(1); }
}
.c-badge.is-active { animation: pop 0.3s ease-out; }
</style>