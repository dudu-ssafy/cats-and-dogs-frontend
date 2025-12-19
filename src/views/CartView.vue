<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router'; // 👈 라우터 추가
import { useCartStore } from '@/stores/cart';

const store = useCartStore();
const router = useRouter(); // 👈 라우터 사용

// 수량 조절 함수 (직접 store 데이터 수정)
const increase = (item) => item.quantity++;
const decrease = (item) => {
  if (item.quantity > 1) item.quantity--;
};

// 선택 삭제 로직 수정
const removeSelected = () => {
  store.cartItems = store.cartItems.filter(item => !item.selected);
};

// 배송비 계산
const shippingFee = computed(() => {
  if (store.totalProductPrice >= 50000 || store.totalProductPrice === 0) return 0;
  return 3000;
});

// 최종 금액
const finalPrice = computed(() => store.totalProductPrice + shippingFee.value);

// 숫자 콤마
const formatPrice = (num) => num.toLocaleString();

// 👈 결제하기 버튼 클릭 시 Order 페이지로 이동하는 함수
const goToOrder = () => {
  if (store.cartItems.length === 0) {
    alert('장바구니에 담긴 상품이 없습니다.');
    return;
  }
  router.push({ name: 'ShopOrder'}); // 라우터 설정에 따라 '/order' 또는 { name: 'Order' }로 변경 가능
};
</script>

<template>
  <div class="cart-wrapper">
    <div class="container">
      <h1 class="page-title">장바구니 <span style="font-size:20px; color:#999; font-weight:500;">({{ store.cartCount }})</span></h1>

      <div class="cart-container">
          <div class="cart-list-box">
              <div class="cart-item" v-for="item in store.cartItems" :key="item.id">
                  <input type="checkbox" v-model="item.selected">
                  <img :src="item.image" class="item-thumb">
                  
                  <div class="item-info">
                      <div class="item-brand">{{ item.brand }}</div>
                      <div class="item-name">{{ item.name }}</div>
                      <span class="item-opt">옵션: {{ item.option }}</span>
                  </div>

                  <div class="qty-box">
                      <button class="qty-btn" @click="decrease(item)">-</button>
                      <input type="text" :value="item.quantity" class="qty-input" readonly>
                      <button class="qty-btn" @click="increase(item)">+</button>
                  </div>

                  <div class="item-price-area">
                      <span class="item-price">{{ formatPrice(item.price * item.quantity) }}원</span>
                      <span class="material-icons-round btn-delete" @click="store.removeItem(item.id)">close</span>
                  </div>
              </div>
          </div>

          <div class="price-summary-box">
              <h3 class="summary-title">결제 금액</h3>
              
              <div class="summary-row">
                  <span>총 상품금액</span>
                  <span style="font-weight:700">{{ formatPrice(store.totalProductPrice) }}원</span>
              </div>
              
              <div class="summary-row">
                  <span>배송비</span>
                  <span style="font-weight:700">+{{ formatPrice(shippingFee) }}원</span>
              </div>

              <div class="summary-row total">
                  <span>최종 결제금액</span>
                  <span class="total-price">{{ formatPrice(finalPrice) }}원</span>
              </div>

              <button class="btn-order" @click="goToOrder">
                {{ store.cartCount }}개 상품 결제하기
              </button>
          </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
/* CSS는 건드리지 않았습니다. 기존에 작성하신 .btn-order 스타일이 그대로 적용됩니다. */

.cart-wrapper {
  --bg-body: #F5F7FA;
  --bg-white: #FFFFFF;
  --primary-honey: #FFD54F;
  --primary-orange: #FF8F00;
  --sale-red: #FF5252;
  --text-title: #111827;
  --text-body: #4B5563;
  --line-border: #E5E7EB;
  --radius-card: 16px;
  --shadow-card: 0 4px 20px rgba(0,0,0,0.04);
  
  font-family: 'NanumSquareRound', sans-serif;
  background-color: var(--bg-body);
  color: var(--text-title);
  min-height: 100vh;
}

button { font-family: 'NanumSquareRound', sans-serif; border: none; cursor: pointer; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

.page-title { font-size: 32px; font-weight: 800; margin: 40px 0 24px; }

.cart-container {
    display: grid; grid-template-columns: 2fr 1fr; gap: 40px; padding-bottom: 100px;
}

.cart-list-box {
    background: var(--bg-white); border-radius: 24px;
    box-shadow: var(--shadow-card); border: 1px solid var(--line-border);
    padding: 0 32px;
}

.cart-header {
    display: flex; justify-content: space-between; align-items: center;
    padding: 24px 0; border-bottom: 1px solid var(--line-border);
    font-weight: 700; color: var(--text-body); font-size: 15px;
}
.chk-group { display: flex; align-items: center; gap: 8px; cursor: pointer; }
.btn-delete-sel { font-size: 14px; color: #999; background: transparent; }
.btn-delete-sel:hover { color: var(--sale-red); text-decoration: underline; }

.cart-item {
    display: flex; align-items: center; gap: 20px; padding: 32px 0;
    border-bottom: 1px dashed var(--line-border);
}
.cart-item:last-child { border-bottom: none; }

input[type="checkbox"] {
    width: 20px; height: 20px; accent-color: var(--primary-orange); cursor: pointer;
}

.item-thumb {
    width: 100px; height: 100px; border-radius: 12px; background: #F3F4F6;
    object-fit: cover; flex-shrink: 0;
}

.item-info { flex: 1; }
.item-brand { font-size: 13px; color: #999; font-weight: 700; margin-bottom: 4px; }
.item-name { font-size: 16px; font-weight: 700; color: var(--text-title); margin-bottom: 8px; line-height: 1.4; }
.item-opt { font-size: 13px; color: #9CA3AF; background: #F9FAFB; padding: 4px 8px; border-radius: 6px; display: inline-block; }

.qty-box {
    display: flex; align-items: center; border: 1px solid var(--line-border);
    border-radius: 8px; overflow: hidden; width: 100px; height: 32px;
}
.qty-btn {
    width: 32px; height: 100%; background: #F9FAFB; color: #666;
    font-size: 16px; display: flex; align-items: center; justify-content: center;
    transition: 0.2s;
}
.qty-btn:hover { background: #E5E7EB; }
.qty-input {
    width: 36px; height: 100%; border: none; text-align: center;
    font-size: 14px; font-weight: 700; outline: none; color: var(--text-title); background: #fff;
}

.item-price-area { text-align: right; min-width: 100px; }
.item-price { font-size: 18px; font-weight: 800; color: var(--text-title); display: block; margin-bottom: 4px; }
.btn-delete { color: #999; font-size: 20px; cursor: pointer; transition: 0.2s; }
.btn-delete:hover { color: var(--sale-red); }


.price-summary-box {
    background: var(--bg-white); border-radius: 24px;
    box-shadow: var(--shadow-card); border: 1px solid var(--line-border);
    padding: 32px; position: sticky; top: 120px; height: fit-content;
}
.summary-title { font-size: 20px; font-weight: 800; margin-bottom: 24px; }

.summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 15px; color: var(--text-body); }
.summary-row.total {
    margin-top: 24px; padding-top: 24px; border-top: 2px dashed var(--line-border);
    font-size: 20px; color: var(--text-title); font-weight: 800; align-items: center;
}
.total-price { font-size: 28px; color: var(--primary-orange); }

.btn-order {
    width: 100%; padding: 18px; margin-top: 32px;
    background: var(--text-title); color: white;
    border-radius: 12px; font-size: 18px; font-weight: 800;
    transition: 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.btn-order:hover { background: var(--primary-orange); transform: translateY(-2px); }

@media (max-width: 900px) {
    .cart-container { grid-template-columns: 1fr; }
    .price-summary-box { position: static; margin-top: 20px; }
}
</style>