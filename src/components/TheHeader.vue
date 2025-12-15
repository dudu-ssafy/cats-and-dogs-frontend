<script setup>
import { computed, ref, onMounted } from 'vue';
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

onMounted(() => {
    userStore.initUser();
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

  <header class="site-header" :class="{ 'ai-mode': isAiPage, 'visible': !isAiPage || isHeaderVisible }" @mouseenter="isHeaderVisible = true" @mouseleave="isHeaderVisible = false">
    <div class="header-inner">
      <router-link to="/" class="header-logo">
        <span class="material-icons-round logo-icon">pets</span>
        <span class="logo-text">함께하개<span class="logo-highlight">냥</span></span>
      </router-link>

      <nav class="header-nav">
        <ul class="nav-list">
          <li><router-link to="/" class="nav-item">홈</router-link></li>
          <li><router-link to="/ai" class="nav-item">AI 진단</router-link></li>
          <li><router-link to="/shorts" class="nav-item">쇼츠</router-link></li>
          <li><router-link to="/community" class="nav-item">커뮤니티</router-link></li>
          <li><router-link to="/shop" class="nav-item">상점</router-link></li>
        </ul>
      </nav>

      <div class="header-right">
        
        <router-link to="/cart" class="cart-btn" v-if="userStore.isLogin && showCartIcon">
            <span class="material-icons-round">shopping_cart</span>
            <span class="cart-badge" v-if="store.cartCount > 0">{{ store.cartCount }}</span>
        </router-link>

        <template v-if="!userStore.isLogin">
             <router-link to="/login" class="login-btn-cute">로그인</router-link>
        </template>
        
        <template v-else>
            <button class="header-logout-btn" @click="userStore.logout">로그아웃</button>
            
            <button class="profile-icon-btn" @click="goToProfileOrLogin">
                <span class="material-icons-round">person</span>
            </button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* =================================== */
/* CSS: 폰트 굵기 조정 및 로그인 버튼 스타일링 */
/* =================================== */
.site-header {
  --h-height: 80px;
  --h-bg: rgba(255, 255, 255, 0.95);
  --h-text: #4A3F35; 
  --h-active: #4A3F35;
  --h-primary: #FFD54F;
  
  width: 100%;
  height: var(--h-height);
  background-color: var(--h-bg);
  backdrop-filter: blur(10px);
  border-bottom: none; 
  box-shadow: 0 1px 10px rgba(0,0,0,0.03); 

  position: sticky; 
  top: 0; 
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.site-header.ai-mode { position: fixed; background-color: rgba(255, 255, 255, 0.9); transform: translateY(-100%); box-shadow: none; }
.site-header.ai-mode.visible { transform: translateY(0); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.hover-trigger { position: fixed; top: 0; left: 0; width: 100%; height: 20px; z-index: 2000; background: transparent; }

.header-inner { 
    max-width: 1200px; 
    margin: 0 auto; 
    padding: 0 20px; 
    height: 100%; 
    display: flex; 
    align-items: center; 
    justify-content: space-between; 
}

/* 1. 로고 영역 */
.header-logo { display: flex; align-items: center; gap: 8px; color: var(--h-active); text-decoration: none; flex-shrink: 0; }
.logo-icon { color: var(--h-primary); font-size: 32px; }
.logo-text { 
    font-size: 28px; 
    font-weight: 700; /* 굵게 */
    letter-spacing: 0px; 
} 
.logo-highlight { color: var(--h-primary); }

/* 2. 네비게이션 영역 */
.header-nav { flex-grow: 1; display: flex; justify-content: center; } 
.nav-list { display: flex; gap: 45px; list-style: none; margin: 0; padding: 0; }
.nav-item { 
    font-size: 20px;
    font-weight: 700; /* 굵게 */
    color: var(--h-text); 
    text-decoration: none; 
    transition: color 0.2s; 
    padding: 8px 0; 
    position: relative; 
    white-space: nowrap; 
}
.nav-item:hover { color: var(--h-active); }
.router-link-active.nav-item { color: var(--h-active); }
.router-link-active.nav-item::after { content: ''; position: absolute; bottom: -4px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background-color: var(--h-primary); border-radius: 50%; }

/* 3. 우측 영역 */
.header-right { 
    display: flex; 
    align-items: center; 
    gap: 15px; 
    flex-shrink: 0; 
}

/* 장바구니 버튼 */
.cart-btn { position: relative; display: flex; align-items: center; justify-content: center; color: #333; text-decoration: none; } 
.cart-btn .material-icons-round { font-size: 28px; transition: 0.2s; }
.cart-btn:hover .material-icons-round { color: var(--h-primary); }
.cart-badge { font-family: sans-serif; }


/* 귀여운 로그인 버튼 (비로그인 시 표시) */
.login-btn-cute {
    background: var(--h-primary); 
    color: white; 
    font-size: 16px; 
    font-weight: 700; 
    padding: 8px 18px; 
    border-radius: 20px; 
    text-decoration: none; 
    transition: 0.2s;
    box-shadow: 0 4px 8px rgba(255, 213, 79, 0.4); 
}
.login-btn-cute:hover {
    background: #FFC107;
    transform: translateY(-1px);
    box-shadow: 0 6px 10px rgba(255, 213, 79, 0.6); 
}

/* 닉네임 표시 영역 스타일 (사용 안 함) */
.user-profile-area { 
    display: none; 
}

/* 🔥 [추가] 헤더 우측 로그아웃 버튼 스타일 (로그인 시 표시) */
.header-logout-btn {
    font-size: 16px; 
    font-weight: 700;
    color: #999; 
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    transition: 0.2s;
}
.header-logout-btn:hover {
    color: #FF5252;
}

/* 프로필 아이콘 버튼 스타일 (로그인 시 표시) */
.profile-icon-btn {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--h-primary); color: white;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 8px rgba(255, 213, 79, 0.4);
    transition: 0.2s;
    flex-shrink: 0;
}
.profile-icon-btn:hover {
    background: #FFC107;
    transform: scale(1.05);
}
</style>