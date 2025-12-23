<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref, onMounted, computed } from 'vue';
import { productApi } from '@/api/product';

// [1] 장바구니 스토어 가져오기
import { useCartStore } from '@/stores/cart'; 

const route = useRoute();
const router = useRouter();
const productId = Number(route.params.id); // ID 숫자 변환

// [2] 스토어 사용 설정
const cartStore = useCartStore();

// 옵션 선택 로직
const selectedOptionId = ref(null);

// ✅ [수정] 장바구니 담기 버튼 함수
const addCart = async () => {
    if(!product.value) return;

    // 옵션 유효성 검사 (옵션이 있는 상품인데 선택 안 한 경우)
    if (product.value.options && product.value.options.length > 0 && !selectedOptionId.value) {
        alert('상품 옵션을 선택해주세요.');
        return;
    }

    try {
        // 1. 스토어의 addToCart 함수 실행
        // 옵션이 있으면 optionId 전달, 없으면 null 전달 (backend에서 처리 필요)
        // 현재 backend는 product_option_id 필수이므로, 
        // 옵션이 없는 상품(Sled 등)을 위해 product_id를 함께 전달하여 처리하도록 구조 변경 필요.
        // 일단 frontend에서는 selectedOptionId가 null일 경우 product.id를 활용하도록 API/Store 수정 전제로 호출.
        
        await cartStore.addToCart(selectedOptionId.value, quantity.value, product.value.id);
        
        // 2. 알림 및 이동
        if(confirm("장바구니에 담았습니다. 이동하시겠습니까?")) {
            router.push('/cart'); 
        }
    } catch (e) {
        // 이미 store에서 에러 처리 함
    }
};

// 수량 조절 로직
const quantity = ref(1);
const increase = () => quantity.value++;
const decrease = () => { if(quantity.value > 1) quantity.value--; };

// 구매하기 버튼
const goOrder = () => {
    if(!product.value) return;
    router.push('/shop/order'); 
};


const productOptions = computed(() => product.value?.options || []);

// 2. 상품 정보
const product = ref(null);
const isLoading = ref(true);

const fetchProductDetail = async () => {
    try {
        const response = await productApi.getProductDetail(productId);
        const data = response.data;
        
        // 이미지 처리: 메인 이미지 찾기 또는 첫 번째 이미지
        const mainImage = data.images?.find(img => img.is_main)?.image_url 
             || data.images?.[0]?.image_url 
             || null;

        product.value = {
            id: data.id,
            brand: 'Cats&Dogs',
            name: data.title,
            price: data.base_price, 
            img: mainImage,
            options: data.options, // API에서 받은 옵션 목록 저장
            detailImg: data.detail_image_url || null // 상세 이미지 매핑
        };
        
        // 옵션이 1개뿐이라면 자동 선택 기능 (편의성)
        if (data.options && data.options.length === 1) {
            selectedOptionId.value = data.options[0].id;
        }

    } catch (error) {
        console.error('Failed to fetch product details:', error);
        alert('상품 정보를 불러오는데 실패했습니다.');
        router.back();
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchProductDetail();
});
</script>

<template>
  <main class="container">
    <div v-if="isLoading" style="text-align: center; padding: 100px;">
        <span class="material-icons-round" style="font-size: 48px; color: #FFD54F; animation: spin 1s infinite linear;">autorenew</span>
        <p>상품 정보를 불러오는 중입니다...</p>
    </div>
        
    <section class="product-top" v-if="product">
        <div class="img-area">
            <img :src="product.img || 'https://via.placeholder.com/500'" alt="상품이미지" class="main-img">
        </div>

        <div class="info-area">
            <div class="badge">BEST</div>
            <p class="p-brand">{{ product.brand }}</p>
            <h1 class="p-title">{{ product.name }}</h1>
            
            <div class="p-price-wrap">
                <span class="p-price">{{ (product.price || 0).toLocaleString() }}</span> <span class="p-unit">원</span>
            </div>

            <!-- 옵션 선택 영역 -->
            <div class="option-area" v-if="product.options && product.options.length > 0">
                <label class="opt-label">옵션 선택</label>
                <select v-model="selectedOptionId" class="opt-select">
                    <option :value="null" disabled>옵션을 선택해주세요</option>
                    <option v-for="opt in product.options" :key="opt.id" :value="opt.id" :disabled="opt.stock <= 0">
                        {{ opt.name }}: {{ opt.value }} 
                        <template v-if="opt.additional_price > 0">(+{{ opt.additional_price.toLocaleString() }}원)</template>
                        <template v-if="opt.stock <= 0"> (품절)</template>
                    </option>
                </select>
            </div>
            
            <div class="divider"></div>

            <div class="option-box">
                <div class="opt-row">
                    <span>배송비</span>
                    <span>3,000원 (5만원 이상 무료)</span>
                </div>
                <div class="opt-row">
                    <span>수량</span>
                    <div class="qty-control">
                        <button class="qty-btn" @click="decrease">-</button>
                        <input type="text" class="qty-input" :value="quantity" readonly>
                        <button class="qty-btn" @click="increase">+</button>
                    </div>
                </div>
            </div>

            <div class="total-price">
                <span class="total-label">총 상품 금액</span>
                <span class="total-val">{{ (product.price * quantity).toLocaleString() }}원</span>
            </div>

            <div class="btn-group">
                <button class="btn btn-cart" @click="addCart">장바구니</button>
                <button class="btn btn-buy" @click="goOrder">구매하기</button>
            </div>
        </div>
    </section>

    <section class="detail-section" v-if="product">
        <h3 class="detail-title">상세 정보</h3>
        <br>
        
        <!-- 상세 이미지가 있으면 렌더링 -->
        <div v-if="product.detailImg" class="detail-content">
             <img :src="product.detailImg" alt="상세 설명 이미지" class="detail-img">
        </div>

        <!-- 없으면 안내 문구 (또는 숨김 처리 가능) -->
        <div v-else class="empty-detail">
            <p style="color:#999; margin-bottom:20px;">
                상세 이미지가 준비 중입니다.
            </p>
            <!-- Placeholder for dev purpose, remove if not needed -->
            <!-- <img src="https://via.placeholder.com/800x1200?text=Detail+Image+Placeholder" class="detail-img-placeholder"> -->
        </div>
    </section>

  </main>
</template>

<style scoped>
/* CSS는 그대로 두셔도 됩니다 */
.container { max-width: 1200px; margin: 40px auto; padding: 0 40px; }

.product-top {
    display: flex; gap: 60px;
    background: #fff; 
    border-radius: 24px;
    padding: 40px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
    border: 1px solid #E5E7EB;
    margin-bottom: 40px;
}

.img-area { flex: 1; }
.main-img {
    width: 100%; height: 500px; border-radius: 16px;
    object-fit: cover; background-color: #f0f0f0;
    border: 1px solid #E5E7EB;
}

.info-area { flex: 1; display: flex; flex-direction: column; }

.badge { display: inline-block; background: #FFD54F; color: #fff; padding: 6px 12px; border-radius: 100px; font-weight: 800; font-size: 13px; margin-bottom: 16px; width: fit-content; }
.p-brand { color: #9CA3AF; font-weight: 700; margin-bottom: 8px; }
.p-title { font-size: 32px; font-weight: 800; line-height: 1.3; margin-bottom: 24px; }

.p-price-wrap { border-bottom: 1px solid #E5E7EB; padding-bottom: 24px; margin-bottom: 24px; }
.option-area { margin-bottom: 24px; }
.opt-label { display: block; font-weight: 700; margin-bottom: 8px; font-size: 15px; }
.opt-select { 
    width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #DDD; 
    font-size: 15px; font-family: 'NanumSquareRound'; outline: none;
}
.divider { height: 1px; background: #EEE; margin: 0 0 30px; }
.p-price { font-size: 32px; font-weight: 800; color: #FF8F00; }
.p-unit { font-size: 20px; color: #4B5563; font-weight: 700; }

.option-box { background: #FAFAFA; border-radius: 12px; padding: 20px; margin-bottom: 30px; }
.opt-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; font-size: 15px; font-weight: 700; color: #4B5563; }
.opt-row:last-child { margin-bottom: 0; }

.qty-control { display: flex; align-items: center; gap: 0; background: #fff; border: 1px solid #E5E7EB; border-radius: 8px; overflow: hidden; }
.qty-btn { width: 32px; height: 32px; border: none; background: none; cursor: pointer; font-weight: bold; }
.qty-btn:hover { background: #f0f0f0; }
.qty-input { width: 40px; text-align: center; border: none; font-family: inherit; font-weight: bold; }

.total-price { display: flex; justify-content: space-between; align-items: center; margin-top: auto; margin-bottom: 20px; padding-top: 20px; border-top: 2px solid #E5E7EB; }
.total-label { font-size: 18px; font-weight: 800; }
.total-val { font-size: 28px; font-weight: 800; color: #111827; }

.btn-group { display: flex; gap: 12px; }
.btn { flex: 1; padding: 20px; border-radius: 12px; font-size: 18px; font-weight: 800; cursor: pointer; transition: 0.2s; border: none; }

.btn-cart { background: #fff; border: 2px solid #E5E7EB; color: #111827; }
.btn-cart:hover { border-color: #111827; background: #FAFAFA; }

.btn-buy { background: #111827; color: #fff; }
.btn-buy:hover { background: #FF8F00; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 143, 0, 0.25); }

.detail-section { text-align: center; padding: 60px 0; border-top: 1px solid #E5E7EB; }
.detail-title { font-size: 24px; font-weight: 800; margin-bottom: 40px; display: inline-block; border-bottom: 3px solid #FFD54F; padding-bottom: 4px; }
.detail-img-placeholder { max-width: 860px; width: 100%; margin: 0 auto; display: block; }

.detail-img {
    width: 100%; 
    max-width: 860px; /* Limit max width for readability */
    height: auto; 
    display: block; 
    margin: 0 auto;
}
</style>