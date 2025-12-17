<script setup>
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';

// [1] 장바구니 스토어 가져오기
import { useCartStore } from '@/stores/cart'; 

const route = useRoute();
const router = useRouter();
const productId = Number(route.params.id); // ID 숫자 변환

// [2] 스토어 사용 설정
const cartStore = useCartStore();

// 2. 상품 정보
const product = ref({
  id: productId, // 현재 페이지 ID 사용
  brand: '네이처키친',
  name: '프리미엄 유기농 강아지 사료 2kg',
  price: 28900, // [중요] 계산을 위해 숫자로 변경! (문자열 X)
  img: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80'
});

// 수량 조절 로직
const quantity = ref(1);
const increase = () => quantity.value++;
const decrease = () => { if(quantity.value > 1) quantity.value--; };

// 구매하기 버튼
const goOrder = () => {
    router.push('/shop/order'); 
};

// ✅ [추가] 장바구니 담기 버튼 함수
const addCart = () => {
    // 1. 스토어의 addToCart 함수 실행 (상품정보 + 수량 전달)
    cartStore.addToCart(product.value, quantity.value);
    
    // 2. 알림 및 이동
    if(confirm("장바구니에 담았습니다. 이동하시겠습니까?")) {
        router.push('/shop/cart'); // 장바구니 페이지로 이동
    }
};

</script>

<template>
  <main class="container">
        
    <section class="product-top">
        <div class="img-area">
            <img :src="product.img" alt="상품이미지" class="main-img">
        </div>

        <div class="info-area">
            <div class="badge">BEST</div>
            <p class="p-brand">{{ product.brand }}</p>
            <h1 class="p-title">{{ product.name }} (상품번호: {{ productId }})</h1>
            
            <div class="p-price-wrap">
                <span class="p-price">{{ product.price.toLocaleString() }}</span> <span class="p-unit">원</span>
            </div>

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

    <section class="detail-section">
        <h3 class="detail-title">상세 정보</h3>
        <br>
        <p style="color:var(--text-body); margin-bottom:20px;">
            등록된 상세 이미지가 아래에 노출됩니다.
        </p>
        <img src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80" class="detail-img-placeholder" style="border-radius: 16px;">
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
</style>