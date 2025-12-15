<script setup>
import { ref } from 'vue';

// 상품 데이터 (나중엔 서버에서 받아오겠죠?)
const products = ref([
  { 
    id: 1, 
    brand: '네이처키친', 
    name: '프리미엄 유기농 강아지 사료 2kg', 
    price: '28,900', 
    originPrice: '34,000',
    discount: '15%', 
    isBest: true 
  },
  { 
    id: 2, 
    brand: '멍멍패션', 
    name: '따뜻한 털안감 체크무늬 겨울 패딩', 
    price: '19,900', 
    originPrice: '29,000',
    discount: '30%', 
    isBest: false 
  },
  // ... 데이터 더 추가 가능
]);
</script>

<template>
  <div class="shop-wrapper">
    <div class="container">
      <section class="shop-hero">
        <div class="hero-content">
          <span class="hero-badge">WINTER SALE ❄️</span>
          <h1 class="hero-title">우리 아이 따뜻한 겨울나기<br>방한용품 최대 50% 할인</h1>
          <div class="btn-hero">구경하러 가기</div>
        </div>
        <div class="hero-img-placeholder">
          강아지 배너 이미지 영역
        </div>
      </section>

      <section class="category-nav">
        <div class="cat-item">
          <div class="cat-icon"><span class="material-icons-round">restaurant</span></div>
          <span class="cat-name">사료/간식</span>
        </div>
        <div class="cat-item">
            <div class="cat-icon"><span class="material-icons-round">checkroom</span></div>
            <span class="cat-name">의류/패션</span>
        </div>
        <div class="cat-item">
            <div class="cat-icon"><span class="material-icons-round">bed</span></div>
            <span class="cat-name">리빙/하우스</span>
        </div>
        <div class="cat-item">
            <div class="cat-icon"><span class="material-icons-round">sports_baseball</span></div>
            <span class="cat-name">장난감</span>
        </div>
        <div class="cat-item">
            <div class="cat-icon"><span class="material-icons-round">medical_services</span></div>
            <span class="cat-name">위생/배변</span>
        </div>
        <div class="cat-item">
            <div class="cat-icon"><span class="material-icons-round">directions_walk</span></div>
            <span class="cat-name">산책/이동</span>
        </div>
      </section>

      <section>
        <div class="section-head">
          <h2 class="section-title">🔥 이번 주 핫딜</h2>
          <div class="sort-filter">
            <span class="sort-active">추천순</span>
            <span>신상품순</span>
            <span>판매량순</span>
            <span>낮은가격순</span>
          </div>
        </div>

        <div class="product-grid">
          <router-link 
            v-for="product in products" 
            :key="product.id"
            :to="`/shop/${product.id}`" 
            class="product-card"
          >
            <div class="badge-best" v-if="product.isBest">BEST</div>
            
            <div class="prod-thumb-box">
              <div class="img-placeholder">
                <span class="material-icons-round" style="font-size:48px; color:#ccc">image</span>
              </div>
              <div class="btn-cart-overlay">
                <span class="material-icons-round">add_shopping_cart</span>
              </div>
            </div>

            <div class="prod-info">
              <div class="prod-brand">{{ product.brand }}</div>
              <div class="prod-name">{{ product.name }}</div>
              <div class="price-row">
                <span class="sale-rate" v-if="product.discount">{{ product.discount }}</span>
                <span class="price-final">{{ product.price }}원</span>
                <span class="price-origin" v-if="product.originPrice">{{ product.originPrice }}</span>
              </div>
            </div>
          </router-link>
          
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* 외부 폰트 import는 삭제 (App.vue나 index.html에 한 번만 있으면 됨) */

.shop-wrapper {
  /* 변수 정의 */
  --bg-body: #F5F7FA;
  --bg-white: #FFFFFF;
  --primary-honey: #FFD54F;
  --primary-orange: #FF8F00;
  --sale-red: #FF5252;
  --text-title: #111827;
  --text-body: #4B5563;
  --text-price: #1A1A1A;
  --line-border: #E5E7EB;
  --radius-card: 16px;
  --shadow-product: 0 4px 20px rgba(0,0,0,0.06);
  --shadow-hover: 0 12px 30px rgba(0,0,0,0.12);

  font-family: 'NanumSquareRound', sans-serif;
  background-color: var(--bg-body);
  color: var(--text-title);
  min-height: 100vh;
  /* 헤더가 빠졌으므로 상단 여백이 필요하면 padding-top 추가 가능 */
  /* padding-top: 40px; */
}

.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

/* ❌ 헤더 스타일 삭제됨 */

/* 히어로 배너 */
.shop-hero {
  height: 320px; margin-top: 24px; border-radius: 24px;
  background: linear-gradient(to right, #FFF8E1, #FFECB3);
  position: relative; overflow: hidden; display: flex; align-items: center;
  margin-bottom: 40px;
}
.hero-content { padding-left: 80px; z-index: 1; }
.hero-badge { 
  background: white; color: var(--primary-orange); font-weight: 800; font-size: 13px;
  padding: 6px 12px; border-radius: 100px; display: inline-block; margin-bottom: 16px;
  box-shadow: 0 4px 10px rgba(255, 143, 0, 0.2);
}
.hero-title { font-size: 42px; font-weight: 900; line-height: 1.2; margin-bottom: 24px; color: #3E2723; }
.btn-hero {
  background: var(--text-title); color: white; padding: 14px 32px; border-radius: 100px;
  font-weight: 700; font-size: 16px; cursor: pointer; transition: 0.2s;
}
.btn-hero:hover { background: #000; transform: translateY(-2px); }

.hero-img-placeholder {
  position: absolute; right: 60px; bottom: 40px; width: 300px; height: 240px;
  background: rgba(255,255,255,0.5); border-radius: 20px;
  display: flex; align-items: center; justify-content: center; font-weight: 700; color: #8d6e63;
}

/* 카테고리 */
.category-nav {
  display: flex; justify-content: space-between; gap: 16px; margin-bottom: 60px;
  background: white; padding: 24px 40px; border-radius: 20px;
  border: 1px solid var(--line-border);
}
.cat-item {
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  cursor: pointer; transition: 0.2s; color: var(--text-body);
}
.cat-item:hover { transform: translateY(-4px); color: var(--text-title); }
.cat-icon {
  width: 64px; height: 64px; background: #F3F4F6; border-radius: 20px;
  display: flex; align-items: center; justify-content: center;
  font-size: 32px; color: var(--text-title); transition: 0.2s;
}
.cat-item:hover .cat-icon { background: var(--primary-honey); color: white; }
.cat-name { font-weight: 700; font-size: 14px; }

/* 상품 그리드 */
.section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; }
.section-title { font-size: 24px; font-weight: 800; }
.sort-filter { font-size: 14px; color: #999; cursor: pointer; display: flex; gap: 16px; }
.sort-active { color: var(--text-title); font-weight: 700; }

.product-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding-bottom: 80px;
}

/* div 대신 router-link로 바뀌었으므로 스타일 적용 */
.product-card {
  display: block; /* a태그는 inline이라 block으로 변경 */
  background: white; border-radius: var(--radius-card);
  overflow: hidden; transition: 0.3s; cursor: pointer;
  border: 1px solid transparent; position: relative;
  text-decoration: none; color: inherit; /* 링크 기본 스타일 제거 */
}
.product-card:hover {
  transform: translateY(-8px); box-shadow: var(--shadow-hover);
  border-color: var(--primary-honey);
}

.prod-thumb-box {
  height: 240px; background: #F0F0F0; position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
}
/* 이미지 없을 때 아이콘 중앙 정렬용 */
.img-placeholder { display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; }

.btn-cart-overlay {
  position: absolute; bottom: 16px; right: 16px;
  width: 40px; height: 40px; border-radius: 50%; background: white;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transform: translateY(10px); transition: 0.2s; color: var(--text-title);
}
.product-card:hover .btn-cart-overlay { opacity: 1; transform: translateY(0); }
.btn-cart-overlay:hover { background: var(--primary-honey); color: white; }

.prod-info { padding: 20px; }
.prod-brand { font-size: 12px; color: #999; margin-bottom: 4px; font-weight: 700; }
.prod-name { font-size: 16px; font-weight: 700; margin-bottom: 12px; line-height: 1.4; height: 44px; overflow: hidden; }

.price-row { display: flex; align-items: flex-end; gap: 8px; }
.sale-rate { font-size: 18px; font-weight: 800; color: var(--sale-red); }
.price-final { font-size: 18px; font-weight: 800; color: var(--text-price); }
.price-origin { font-size: 13px; color: #CCC; text-decoration: line-through; margin-bottom: 2px; }

.badge-best {
  position: absolute; top: 16px; left: 16px;
  background: var(--text-title); color: white; font-size: 11px; font-weight: 800;
  padding: 4px 8px; border-radius: 4px; z-index: 10;
}
</style>