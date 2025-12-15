<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '@/stores/cart'; // Pinia 스토어 가져오기

// 1. 현재 주소 정보를 가져옵니다.
const route = useRoute();
const store = useCartStore(); // 스토어 연결

// 2. 현재 주소(URL)에 '/shop'이라는 단어가 들어있을 때만 true를 반환합니다.
const showCartIcon = computed(() => {
  return route.path.includes('/shop');
});
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      
      <router-link to="/" class="header-logo">
        <span class="material-icons-round logo-icon">pets</span>
        <span class="logo-text">함께하개<span class="logo-highlight">냥</span></span>
      </router-link>

      <nav class="header-nav">
        <ul class="nav-list">
          <li><router-link to="/" class="nav-item">홈</router-link></li>
          <li><a href="#" class="nav-item">AI 진단</a></li>
          <li><a href="#" class="nav-item">커뮤니티</a></li>
          <li><router-link to="/shop" class="nav-item">상점</router-link></li>
        </ul>
      </nav>

      <div class="header-right">
        
       <router-link to="/cart" class="cart-btn" v-if="showCartIcon">
          <span class="material-icons-round">shopping_cart</span>
          <span class="cart-badge" v-if="store.cartCount > 0">
            {{ store.cartCount }}
          </span>
      </router-link>

        <button type="button" class="user-profile-btn">
          <div class="profile-thumb"></div>
        </button>
      </div>

    </div>
  </header>
</template>

<style scoped>
/* =========================================
   헤더 전체 레이아웃
   ========================================= */
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
  position: sticky; top: 0; z-index: 1000;
}

.header-inner {
  max-width: 1200px; margin: 0 auto; padding: 0 40px;
  height: 100%; display: flex; align-items: center; justify-content: space-between;
}

/* =========================================
   로고 & 네비게이션
   ========================================= */
.header-logo { display: flex; align-items: center; gap: 6px; text-decoration: none; color: var(--h-active); cursor: pointer; }
.logo-icon { color: var(--h-primary); font-size: 26px; }
.logo-text { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; }
.logo-highlight { color: var(--h-primary); }

.nav-list { display: flex; gap: 40px; list-style: none; margin: 0; padding: 0; }
.nav-item {
  font-size: 17px; font-weight: 700; color: var(--h-text);
  text-decoration: none; transition: color 0.2s; padding: 8px 0;
  position: relative;
}
.nav-item:hover { color: var(--h-active); }

/* 현재 보고 있는 페이지 메뉴 강조 (Vue Router 기능) */
.router-link-active.nav-item { color: var(--h-active); font-weight: 800; }
.router-link-active.nav-item::after {
  content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%);
  width: 6px; height: 6px; background-color: var(--h-primary); border-radius: 50%;
}

/* =========================================
   우측 영역 (장바구니 + 프로필)
   ========================================= */
.header-right { display: flex; align-items: center; gap: 24px; }

/* 장바구니 버튼 래퍼 */
.cart-btn {
  position: relative; /* 배지 위치 기준점 */
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #333;
}
.cart-btn .material-icons-round { font-size: 28px; transition: 0.2s; }
.cart-btn:hover .material-icons-round { color: var(--h-primary); }

/* 빨간색 숫자 배지 스타일 */
.cart-badge {
  position: absolute; top: -5px; right: -8px;
  background-color: #FF5252; color: white;
  font-size: 11px; font-weight: 800;
  min-width: 18px; height: 18px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  padding: 2px; box-shadow: 0 2px 4px rgba(0,0,0,0.2); 
  border: 2px solid #fff;
}

/* 프로필 사진 */
.user-profile-btn { background: none; border: none; cursor: pointer; padding: 0; display: flex; }
.profile-thumb {
  width: 38px; height: 38px; background-color: #EEE;
  border-radius: 50%; border: 2px solid #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  background-image: url('https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=100&q=80');
  background-size: cover;
}
</style>