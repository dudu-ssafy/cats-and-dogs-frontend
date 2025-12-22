<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { productApi } from '@/api/product';

// 상품 데이터
const products = ref([]);
const isLoading = ref(false);

const isEventPage = ref(false);
const selectedCategory = ref('전체');

const fetchProducts = async () => {
    isLoading.value = true;
    try {
        const params = {};
        if (selectedCategory.value !== '전체') {
            params.category = selectedCategory.value;
        }
        
        const response = await productApi.getProducts(params);
        
        // 백엔드 데이터를 프론트엔드 포맷으로 매핑
        products.value = response.data.map(p => ({
            id: p.id,
            category: p.category_name,
            brand: 'Cats&Dogs', // 브랜드 정보 없음
            name: p.title,
            price: p.base_price.toLocaleString(), // 콤마 포맷팅
            originPrice: null, // 할인 전 가격 정보 없음
            discount: null, // 할인율 정보 없음
            isBest: false, // 베스트 여부 정보 없음
            img: p.main_image || null // 이미지 URL
        }));
    } catch (error) {
        console.error('Failed to fetch products:', error);
    } finally {
        isLoading.value = false;
    }
};

const setCategory = (categoryName) => {
  selectedCategory.value = categoryName;
  isEventPage.value = false; 
};

// 카테고리 변경 감지
watch(selectedCategory, () => {
    fetchProducts();
});

onMounted(() => {
    fetchProducts();
});

const showEventPage = () => { isEventPage.value = true; };
const goBackToShop = () => { isEventPage.value = false; };

const filteredProducts = computed(() => products.value);

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
            <div class="cat-icon--pure">
              <img src="@/assets/images/shop_all_icon.png" alt="전체보기" class="cat-img--all">
            </div>
            <span class="cat-name">전체보기</span>
          </div>

          <div class="cat-item" @click="setCategory('사료/간식')" :class="{ 'is-active': selectedCategory === '사료/간식' }">
            <div class="cat-icon--pure">
              <img src="@/assets/images/shop_all_food.png" alt="사료/간식" class="cat-img--all">
            </div>
            <span class="cat-name">사료/간식</span>
          </div>

          <div class="cat-item" @click="setCategory('의류/패션')" :class="{ 'is-active': selectedCategory === '의류/패션' }">
            <div class="cat-icon--pure">
              <img src="@/assets/images/shop_all_clothes.png" alt="의류/패션" class="cat-img--all cat-img--clothes">
            </div>
            <span class="cat-name">의류/패션</span>
          </div>

          <div class="cat-item" @click="setCategory('리빙/하우스')" :class="{ 'is-active': selectedCategory === '리빙/하우스' }">
            <div class="cat-icon--pure">
              <img src="@/assets/images/shop_all_living.png" alt="리빙/하우스" class="cat-img--all">
            </div>
            <span class="cat-name">리빙/하우스</span>
          </div>

          <div class="cat-item" @click="setCategory('장난감')" :class="{ 'is-active': selectedCategory === '장난감' }">
            <div class="cat-icon--pure">
              <img src="@/assets/images/shop_all_toy.png" alt="장난감" class="cat-img--all">
            </div>
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
                <img v-if="product.img" :src="product.img" alt="상품 이미지" style="width:100%; height:100%; object-fit:cover;">
                <div v-else class="img-placeholder"><span class="material-icons-round" style="font-size:48px; color:#ccc">image</span></div>
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
                <img v-if="product.img" :src="product.img" alt="상품 이미지" style="width:100%; height:100%; object-fit:cover;">
                <div v-else class="img-placeholder"><span class="material-icons-round">redeem</span></div>
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
   1. STRUCTURE (구조): 레이아웃 및 정렬
   ============================================================ */
.shop-hero {
  aspect-ratio: 1200 / 450;
  width: 100%;
  margin-top: 24px;
  margin-bottom: 40px;
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.banner__content {
  position: relative;
  z-index: 2;
  padding-left: 80px; 
  transform: translateY(-10px);
}

.cat-icon--pure {
  width: 120px;
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}

.cat-img--all {
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.cat-img--clothes {
  transform: scale(1.3);
}

/* ============================================================
   2. SKIN (스킨): 배경 이미지 배율 축소 및 위치 최적화
   ============================================================ */
.banner--winter {
  background: linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)),
              url('@/assets/images/two-girls-with-small-dog-are-sitting-couch-new-year-s-eve.jpg') no-repeat;
  
  /* [수정] 너무 컸던 배율을 160%에서 130%로 축소하여 부담을 줄임 */
  background-size: 130% auto;
  
  /* [수정] 배율이 줄어든 만큼 강아지가 잘 보이도록 위치를 5% 지점으로 미세 조정 */
  background-position: 5% center; 
}

.banner__subtitle {
  font-size: 24px;
  font-weight: 700;
  color: #FFF9C4; 
  margin-bottom: 12px;
  letter-spacing: -0.5px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.banner__title {
  font-size: 58px;
  font-weight: 900;
  color: #ffffff;
  margin-bottom: 35px;
  line-height: 1.1;
  text-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.btn--elegant-red {
  display: inline-block;
  background-color: #B71C1C;
  color: #FFFFFF;
  padding: 16px 48px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(183, 28, 28, 0.2);
}

.btn--elegant-red:hover {
  transform: translateY(-3px);
  background-color: #D32F2F;
  box-shadow: 0 12px 25px rgba(183, 28, 28, 0.3);
}

/* 아이콘 활성화 필터 효과 */
.cat-item.is-active .cat-img--all {
  filter: drop-shadow(0 0 15px rgba(255, 213, 79, 0.8));
}

.cat-item.is-active .cat-img--all:not(.cat-img--clothes) {
  transform: scale(1.2);
}

.cat-item.is-active .cat-img--clothes {
  transform: scale(1.5);
}

/* ============================================================
   기존 스타일 유지 (절대 수정하지 않음)
   ============================================================ */
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
.category-nav { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 60px; background: white; padding: 24px 40px; border-radius: 20px; border: 1px solid #E5E7EB; align-items: flex-end; }
.cat-item { display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; transition: 0.2s; color: #4B5563; }
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