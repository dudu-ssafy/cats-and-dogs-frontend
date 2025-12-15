<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart';

const route = useRoute();
const store = useCartStore();

// AI 페이지인지 확인
const isAiPage = computed(() => route.path === '/ai');

// 장바구니 아이콘 표시 여부 (상점 페이지일 때만)
const showCartIcon = computed(() => route.path.includes('/shop'));

// 헤더 보임 여부 (마우스 오버용)
const isHeaderVisible = ref(false);
</script>

<template>
  <div 
    v-if="isAiPage" 
    class="hover-trigger"
    @mouseenter="isHeaderVisible = true"
  ></div>

  <header 
    class="site-header" 
    :class="{ 
      'ai-mode': isAiPage, 
      'visible': !isAiPage || isHeaderVisible 
    }"
    @mouseenter="isHeaderVisible = true"
    @mouseleave="isHeaderVisible = false"
  >
    <div class="header-inner">
      <router-link to="/" class="header-logo">
        <span class="material-icons-round logo-icon">pets</span>
        <span class="logo-text">함께하개<span class="logo-highlight">냥</span></span>
      </router-link>

      <nav class="header-nav">
        <ul class="nav-list">
          <li><router-link to="/" class="nav-item">홈</router-link></li>
          <li><router-link to="/ai" class="nav-item">AI 진단</router-link></li>
          <li><a href="#" class="nav-item">커뮤니티</a></li>
          <li><router-link to="/shop" class="nav-item">상점</router-link></li>
        </ul>
      </nav>

      <div class="header-right">
        <router-link to="/cart" class="cart-btn" v-if="showCartIcon">
            <span class="material-icons-round">shopping_cart</span>
            <span class="cart-badge" v-if="store.cartCount > 0">{{ store.cartCount }}</span>
        </router-link>
        <button type="button" class="user-profile-btn">
          <div class="profile-thumb"></div>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* 기존 변수 및 스타일 유지 */
.site-header {
  --h-height: 80px;
  --h-bg: rgba(255, 255, 255, 0.95);
  --h-border: #EAEAEA;
  --h-text: #999999;
  --h-active: #4A3F35;
  --h-primary: #FFD54F;
  
  width: 100%;
  height: var(--h-height);
  background-color: var(--h-bg);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--h-border);
  
  /* 기본 상태: 상단 고정 (Sticky) */
  position: sticky; 
  top: 0; 
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

/* 🔥 [핵심] AI 모드일 때 스타일 재정의 */
.site-header.ai-mode {
  position: fixed; /* 화면 위에 둥둥 뜨게 변경 */
  border-bottom: none; /* 경계선 없애서 더 깔끔하게 */
  background-color: rgba(255, 255, 255, 0.9); /* 약간 투명하게 */
  transform: translateY(-100%); /* 화면 위로 숨기기! */
  box-shadow: none;
}

/* 🔥 [핵심] AI 모드지만 '보임' 상태일 때 */
.site-header.ai-mode.visible {
  transform: translateY(0); /* 다시 내려오기 */
  box-shadow: 0 4px 20px rgba(0,0,0,0.05); /* 내려왔을 때 그림자 */
}

/* 🔥 [핵심] 마우스 감지 영역 (투명한 천장) */
.hover-trigger {
  position: fixed;
  top: 0; left: 0;
  width: 100%;
  height: 20px; /* 상단 20px 영역 */
  z-index: 2000; /* 헤더보다 위에 있어야 함 */
  background: transparent; /* 투명 */
}

/* 기존 내부 스타일들 (그대로 둠) */
.header-inner { max-width: 1200px; margin: 0 auto; padding: 0 40px; height: 100%; display: flex; align-items: center; justify-content: space-between; }
.header-logo { display: flex; align-items: center; gap: 6px; text-decoration: none; color: var(--h-active); cursor: pointer; }
.logo-icon { color: var(--h-primary); font-size: 26px; }
.logo-text { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.logo-highlight { color: var(--h-primary); }
.nav-list { display: flex; gap: 40px; list-style: none; margin: 0; padding: 0; }
.nav-item { font-size: 17px; font-weight: 700; color: var(--h-text); text-decoration: none; transition: color 0.2s; padding: 8px 0; position: relative; }
.nav-item:hover { color: var(--h-active); }
.router-link-active.nav-item { color: var(--h-active); font-weight: 800; }
.router-link-active.nav-item::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background-color: var(--h-primary); border-radius: 50%; }
.header-right { display: flex; align-items: center; gap: 24px; }
.cart-btn { position: relative; display: flex; align-items: center; justify-content: center; cursor: pointer; color: #333; }
.cart-btn .material-icons-round { font-size: 28px; transition: 0.2s; }
.cart-btn:hover .material-icons-round { color: var(--h-primary); }
.cart-badge { position: absolute; top: -5px; right: -8px; background-color: #FF5252; color: white; font-size: 11px; font-weight: 800; min-width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center; justify-content: center; padding: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); border: 2px solid #fff; }
.user-profile-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
.profile-thumb { width: 38px; height: 38px; background-color: #EEE; border-radius: 50%; border: 2px solid #fff; box-shadow: 0 2px 5px rgba(0,0,0,0.05); background-image: url('https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=100&q=80'); background-size: cover; }
</style>