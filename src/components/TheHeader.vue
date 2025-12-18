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

  <header 
    class="site-header" 
    :class="{ 'ai-mode': isAiPage, 'visible': !isAiPage || isHeaderVisible }" 
    @mouseenter="isHeaderVisible = true" 
    @mouseleave="isHeaderVisible = false"
  >
    <div class="header-inner container-l">
      <router-link to="/" class="header-logo o-flex-center">
        <span class="material-icons-round logo-icon">pets</span>
        <span class="logo-text u-text-bold">함께하개<span class="logo-highlight">냥</span></span>
      </router-link>

      <nav class="header-nav">
        <ul class="nav-list o-flex-center">
          <li><router-link to="/ai" class="nav-item u-text-bold">AI 진단</router-link></li>
          <li><router-link to="/shorts" class="nav-item u-text-bold">쇼츠</router-link></li>
          <li><router-link to="/community" class="nav-item u-text-bold">커뮤니티</router-link></li>
          <li><router-link to="/shop" class="nav-item u-text-bold">상점</router-link></li>
        </ul>
      </nav>

      <div class="header-right o-flex-center">
        <router-link to="/cart" class="cart-btn" v-if="userStore.isLogin && showCartIcon">
            <span class="material-icons-round">shopping_cart</span>
            <span class="cart-badge" v-if="store.cartCount > 0">{{ store.cartCount }}</span>
        </router-link>

        <template v-if="!userStore.isLogin">
             <router-link to="/login" class="btn-primary-round u-text-bold">로그인</router-link>
        </template>
        
        <template v-else>
            <button class="header-logout-btn u-text-bold" @click="userStore.logout">로그아웃</button>
            <button class="profile-icon-btn btn-round-icon" @click="goToProfileOrLogin">
                <span class="material-icons-round">person</span>
            </button>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
/* ============================================================
   OOCSS - Objects (구조 & 레이아웃)
   ============================================================ */
.o-flex-center { display: flex; align-items: center; }
.container-l { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

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
  box-shadow: 0 1px 10px rgba(0,0,0,0.03); 
  position: sticky; 
  top: 0; 
  z-index: 1000;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.header-inner { height: 100%; display: flex; align-items: center; justify-content: space-between; }
.header-nav { flex-grow: 1; display: flex; justify-content: center; } 
.nav-list { gap: 45px; list-style: none; margin: 0; padding: 0; }
.header-right { gap: 15px; flex-shrink: 0; }

/* ============================================================
   OOCSS - Components & Skins (외형 & 테마)
   ============================================================ */

/* Utility */
.u-text-bold { font-weight: 700; }

/* AI Mode Modifier */
.site-header.ai-mode { position: fixed; background-color: rgba(255, 255, 255, 0.9); transform: translateY(-100%); box-shadow: none; }
.site-header.ai-mode.visible { transform: translateY(0); box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
.hover-trigger { position: fixed; top: 0; left: 0; width: 100%; height: 20px; z-index: 2000; background: transparent; }

/* Logo */
.header-logo { gap: 8px; color: var(--h-active); text-decoration: none; flex-shrink: 0; }
.logo-icon { color: var(--h-primary); font-size: 32px; }
.logo-text { font-size: 28px; letter-spacing: 0px; } 
.logo-highlight { color: var(--h-primary); }

/* Nav Item */
.nav-item { 
    font-size: 20px;
    color: var(--h-text); 
    text-decoration: none; 
    transition: color 0.2s; 
    padding: 8px 0; 
    position: relative; 
    white-space: nowrap; 
}
.nav-item:hover, .router-link-active.nav-item { color: var(--h-active); }
.router-link-active.nav-item::after { 
    content: ''; position: absolute; bottom: -4px; left: 50%; 
    transform: translateX(-50%); width: 6px; height: 6px; 
    background-color: var(--h-primary); border-radius: 50%; 
}

/* Buttons & Icons */
.btn-primary-round {
    background: var(--h-primary); color: white; 
    font-size: 16px; padding: 8px 18px; 
    border-radius: 20px; text-decoration: none; 
    transition: 0.2s;
    box-shadow: 0 4px 8px rgba(255, 213, 79, 0.4); 
}
.btn-primary-round:hover {
    background: #FFC107; transform: translateY(-1px);
    box-shadow: 0 6px 10px rgba(255, 213, 79, 0.6); 
}

.btn-round-icon {
    width: 40px; height: 40px; border-radius: 50%;
    background: var(--h-primary); color: white;
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 4px 8px rgba(255, 213, 79, 0.4);
    transition: 0.2s; flex-shrink: 0;
}
.btn-round-icon:hover { background: #FFC107; transform: scale(1.05); }

.cart-btn { position: relative; color: #333; text-decoration: none; } 
.cart-btn .material-icons-round { font-size: 28px; transition: 0.2s; }
.cart-btn:hover .material-icons-round { color: var(--h-primary); }

.header-logout-btn {
    font-size: 16px; color: #999; 
    background: none; border: none;
    cursor: pointer; padding: 0; transition: 0.2s;
}
.header-logout-btn:hover { color: #FF5252; }
</style>