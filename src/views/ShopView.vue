<script setup>
import { ref, computed } from 'vue';

// 상품 데이터
const products = ref([
  { id: 1, category: '사료/간식', brand: '네이처키친', name: '프리미엄 유기농 강아지 사료 2kg', price: '28,900', originPrice: '34,000', discount: '15%', isBest: true },
  { id: 2, category: '의류/패션', brand: '멍멍패션', name: '따뜻한 털안감 체크무늬 겨울 패딩', price: '19,900', originPrice: '29,000', discount: '30%', isBest: false },
  { id: 3, category: '사료/간식', brand: '고메펫', name: '국산 닭가슴살 수제 간식 100g', price: '9,900', originPrice: '12,000', discount: '17%', isBest: true },
  { id: 4, category: '장난감', brand: '플레이독', name: '치석제거에 좋은 면로프 토이', price: '5,500', originPrice: '8,000', discount: '31%', isBest: false },
  { id: 5, category: '리빙/하우스', brand: '꿀잠펫', name: '극세사 마카롱 펫 베드', price: '35,000', originPrice: '42,000', discount: '16%', isBest: true },
]);

const isEventPage = ref(false);
const selectedCategory = ref('전체');

const setCategory = (categoryName) => {
  selectedCategory.value = categoryName;
  isEventPage.value = false; 
};

const showEventPage = () => { isEventPage.value = true; };
const goBackToShop = () => { isEventPage.value = false; };

const filteredProducts = computed(() => {
  if (selectedCategory.value === '전체') return products.value;
  return products.value.filter(p => p.category === selectedCategory.value);
});

const top5Products = computed(() => [...products.value].slice(0, 5));
</script>

<template>
  <div class="shop-wrapper">
    <div class="container">
      
      <template v-if="!isEventPage">
        <section class="shop-hero banner--winter">
          <div class="banner__content">
            <p class="banner__subtitle">우리아이 따뜻한 겨울나기</p>
            <h1 class="banner__title">방한용품 보러가기</h1>
            <div class="btn--elegant-red" @click="showEventPage">구성하러 가기</div>
          </div>
        </section>

        <section class="category-nav">
          <div class="cat-item" @click="setCategory('전체')" :class="{ 'is-active': selectedCategory === '전체' }">
            <div class="cat-icon"><span class="material-icons-round">grid_view</span></div>
            <span class="cat-name">전체보기</span>
          </div>
          <div class="cat-item" @click="setCategory('사료/간식')" :class="{ 'is-active': selectedCategory === '사료/간식' }">
            <div class="cat-icon"><span class="material-icons-round">restaurant</span></div>
            <span class="cat-name">사료/간식</span>
          </div>
          <div class="cat-item" @click="setCategory('의류/패션')" :class="{ 'is-active': selectedCategory === '의류/패션' }">
              <div class="cat-icon"><span class="material-icons-round">checkroom</span></div>
              <span class="cat-name">의류/패션</span>
          </div>
          <div class="cat-item" @click="setCategory('리빙/하우스')" :class="{ 'is-active': selectedCategory === '리빙/하우스' }">
              <div class="cat-icon"><span class="material-icons-round">bed</span></div>
              <span class="cat-name">리빙/하우스</span>
          </div>
          <div class="cat-item" @click="setCategory('장난감')" :class="{ 'is-active': selectedCategory === '장난감' }">
              <div class="cat-icon"><span class="material-icons-round">sports_baseball</span></div>
              <span class="cat-name">장난감</span>
          </div>
        </section>

        <section>
          <div class="section-head">
            <h2 class="section-title">
              {{ selectedCategory === '전체' ? '🔥 이번 주 핫딜' : `📍 ${selectedCategory} 추천 상품` }}
            </h2>
          </div>

          <div class="product-grid">
            <router-link v-for="product in filteredProducts" :key="product.id" :to="`/shop/${product.id}`" class="product-card">
              <div class="prod-thumb-box">
                <div class="img-placeholder"><span class="material-icons-round" style="font-size:48px; color:#ccc">image</span></div>
              </div>
              <div class="prod-info">
                <div class="prod-brand">{{ product.brand }}</div>
                <div class="prod-name">{{ product.name }}</div>
                <div class="price-row">
                  <span class="sale-rate">{{ product.discount }}</span>
                  <span class="price-final">{{ product.price }}원</span>
                </div>
              </div>
            </router-link>
          </div>
        </section>
      </template>

      <template v-else>
        <section class="event-page theme-christmas">
          <div class="event-header u-text-center">
            <h2 class="event-title">🎄 Merry Christmas! 🎄</h2>
            <p class="event-subtitle">산타가 고른 이번 주 인기 TOP 5 상품</p>
            <button class="btn-back" @click="goBackToShop">← 일반 상점으로 돌아가기</button>
          </div>
          <div class="product-grid grid-top5">
            <router-link v-for="(product, index) in top5Products" :key="product.id" :to="`/shop/${product.id}`" class="product-card card-event">
              <div class="event-rank">{{ index + 1 }}</div>
              <div class="prod-thumb-box box-event">
                <div class="img-placeholder"><span class="material-icons-round">redeem</span></div>
              </div>
              <div class="prod-info">
                <div class="prod-name">{{ product.name }}</div>
                <div class="price-row">
                  <span class="price-final">{{ product.price }}원</span>
                </div>
              </div>
            </router-link>
          </div>
        </section>
      </template>

    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   1. STRUCTURE (구조): 레이아웃과 배치를 담당
   ============================================================ */
.shop-hero {
  /* 이미지 비율에 맞춘 높이 설정 (찌그러짐 방지) */
  aspect-ratio: 1200 / 450;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 40px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.banner__content {
  position: relative;
  z-index: 2;
  /* 텍스트 가독성을 위해 상단에서 살짝 내림 */
  transform: translateY(-10px);
}

/* ============================================================
   2. SKIN (스킨): 색상, 글꼴, 시각적 스타일링
   ============================================================ */
.banner--winter {
  background-image: url('@/assets/images/baegyeong-heuligee-salangseuleoun-huinsaeg-gang-ajiui-geunjeob-chwal-yeong-syas.jpg'); 
  background-size: cover;
  background-position: center;
}

.banner__subtitle {
  font-size: 22px;
  font-weight: 700;
  /* 사진 속 강아지의 짙은 밤색 눈동자 컬러를 활용하여 붕 뜨지 않게 조절 */
  color: #5D4037;
  margin-bottom: 10px;
  letter-spacing: -0.5px;
}

.banner__title {
  /* 크기를 52px로 조정하여 부담스럽지 않게 수정 */
  font-size: 52px;
  font-weight: 900;
  color: #FFFFFF;
  margin-bottom: 30px;
  line-height: 1.2;
  /* 밝은 배경에서 흰 글씨가 잘 보이도록 부드러운 그림자 추가 */
  text-shadow: 0 4px 15px rgba(93, 64, 55, 0.3);
}

/* [OOCSS] 버튼 객체: 촌스러운 주황색 대신 세련된 딥 레드 적용 */
.btn--elegant-red {
  display: inline-block;
  background-color: #B71C1C; /* 산타 옷의 클래식 레드 */
  color: #FFFFFF;
  padding: 14px 42px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(183, 28, 28, 0.2);
}

.btn--elegant-red:hover {
  transform: translateY(-3px);
  background-color: #D32F2F;
  box-shadow: 0 6px 20px rgba(183, 28, 28, 0.4);
}

/* ============================================================
   기존 스타일 유지 (수정하지 않음)
   ============================================================ */
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.category-nav { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 60px; background: white; padding: 24px 40px; border-radius: 20px; border: 1px solid #E5E7EB; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; transition: 0.2s; color: #4B5563; }
.cat-icon { width: 64px; height: 64px; background: #F3F4F6; border-radius: 20px; display: flex; align-items: center; justify-content: center; font-size: 32px; color: #111827; }
.cat-item.is-active .cat-icon { background: #FFD54F; color: white; }
.section-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; }
.section-title { font-size: 24px; font-weight: 800; }
.product-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; padding-bottom: 80px; }
.product-card { display: block; background: white; border-radius: 16px; overflow: hidden; transition: 0.3s; position: relative; text-decoration: none; color: inherit; border: 1px solid transparent; }
.product-card:hover { transform: translateY(-8px); border-color: #FFD54F; box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
.prod-thumb-box { height: 240px; background: #F0F0F0; display: flex; align-items: center; justify-content: center; }
.prod-info { padding: 20px; }
.price-final { font-size: 18px; font-weight: 800; }
.u-text-center { text-align: center; }

.theme-christmas { background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); color: #fff; border: 8px double #d4af37; padding: 60px 0; border-radius: 40px; margin: 40px 0; }
.event-rank { position: absolute; top: -10px; left: -10px; width: 40px; height: 40px; background: #ef4444; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 900; z-index: 20; }
.btn-back { background: transparent; color: #fff; border: 1px solid #fff; padding: 10px 24px; border-radius: 100px; cursor: pointer; margin-top: 20px; transition: 0.3s; }
.btn-back:hover { background: #fff; color: #064e3b; }
</style>