<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '@/stores/cart'; // 👈 실데이터를 위해 Pinia 스토어 임포트

const router = useRouter();
const store = useCartStore(); // 👈 스토어 인스턴스 사용

// 1. 배송비 계산 (5만원 이상 무료배송, 상품이 없으면 0원)
const shippingFee = computed(() => {
  if (store.totalProductPrice >= 50000 || store.totalProductPrice === 0) return 0;
  return 3000;
});

// 2. 최종 결제 금액 (상품 총액 + 배송비)
const finalPrice = computed(() => store.totalProductPrice + shippingFee.value);

// 3. 숫자 콤마 포맷팅 함수
const formatPrice = (num) => num.toLocaleString();

import { paymentApi } from '@/api/payment';

// 4. 결제하기 처리 함수
const handlePayment = async () => {
  if (store.cartItems.length === 0) {
    alert('결제할 상품이 장바구니에 없습니다.');
    return;
  }

  const confirmMsg = `${formatPrice(finalPrice.value)}원을 결제하시겠습니까?`;
  
  if(confirm(confirmMsg)) {
    try {
        const response = await paymentApi.kakaoReady();
        const { next_redirect_pc_url } = response.data;
        
        if (next_redirect_pc_url) {
            // 카카오페이 결제 화면으로 이동
            window.location.href = next_redirect_pc_url;
        } else {
            alert('결제 시작에 실패했습니다.');
        }

        // 결제 성공 후 로직은 리다이렉트 페이지에서 처리됨
    } catch (e) {
        console.error(e);
        alert('결제 요청 중 오류가 발생했습니다.');
    }
  }
};
// 5. 마운트 시 데이터 갱신
import { onMounted } from 'vue';
onMounted(() => {
    store.fetchCart();
});
</script>

<template>
  <div class="order-page">
    <div class="container">
      <h1 class="page-title">주문/결제</h1>

      <div class="checkout-grid">
        
        <div class="left-col">
          
          <section class="c-card c-card--shadow u-mb-24">
            <h3 class="sec-title">
              <span class="material-icons-round">local_shipping</span>배송지 정보
            </h3>
            
            <div class="input-group">
              <label class="label">받는 분</label>
              <input type="text" class="form-input" placeholder="이름을 입력하세요">
            </div>
            <div class="input-group">
              <label class="label">연락처</label>
              <input type="text" class="form-input" placeholder="010-0000-0000">
            </div>
            <div class="input-group">
              <label class="label">주소</label>
              <input type="text" class="form-input u-mb-8" placeholder="우편번호 찾기">
              <input type="text" class="form-input" placeholder="상세 주소를 입력하세요">
            </div>
            <div class="input-group">
              <label class="label">배송 메모</label>
              <input type="text" class="form-input" placeholder="예: 문 앞에 놔주세요.">
            </div>
          </section>

          <section class="c-card c-card--shadow">
            <h3 class="sec-title">
              <span class="material-icons-round">shopping_bag</span>
              주문 상품 ({{ store.cartCount }}개)
            </h3>
            
            <div class="order-item" v-for="item in store.cartItems" :key="item.id">
              <!-- 이미지: 백엔드 필드 없음, 임시 처리 -->
              <img :src="'https://via.placeholder.com/70'" class="item-thumb">
              <div class="item-info">
                <p class="item-name">{{ item.product_name }}</p>
                <p class="item-opt">옵션: {{ item.option_value || '없음' }} / {{ item.quantity }}개</p>
              </div>
              <!-- 가격 필드 수정: item.price -> item.price_at_addition -->
              <div class="item-price">{{ formatPrice(item.price_at_addition * item.quantity) }}원</div>
            </div>

            <div v-if="store.cartItems.length === 0" class="empty-msg">
              주문할 상품이 없습니다.
            </div>
          </section>
        </div>

        <div class="right-col u-sticky-top">
          <section class="c-card c-card--shadow">
            <h3 class="sec-title">
              <span class="material-icons-round">receipt_long</span>결제 금액
            </h3>
            
            <div class="summary-row">
              <span>총 상품금액</span>
              <span>{{ formatPrice(store.totalProductPrice) }}원</span>
            </div>
            <div class="summary-row">
              <span>배송비</span>
              <span>+{{ formatPrice(shippingFee) }}원</span>
            </div>
            
            <div class="summary-row total-row">
              <span>최종 결제금액</span>
              <span class="total-price-text">{{ formatPrice(finalPrice) }}원</span>
            </div>

            <button class="c-btn c-btn--primary c-btn--full" @click="handlePayment">
              {{ formatPrice(finalPrice) }}원 결제하기
            </button>
          </section>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* ============================================================
   1. 디자인 시스템 변수
   ============================================================ */
.order-page {
  --bg-body: #F5F7FA;
  --bg-white: #FFFFFF;
  --primary-orange: #FF8F00;
  --text-title: #111827;
  --text-body: #4B5563;
  --line-border: #E5E7EB;
  
  background-color: var(--bg-body);
  min-height: 100vh;
  padding-bottom: 100px;
  color: var(--text-title);
  font-family: 'NanumSquareRound', sans-serif;
}

/* ============================================================
   2. OOCSS Objects (재사용 가능한 구조)
   ============================================================ */
.container { max-width: 1100px; margin: 0 auto; padding: 40px; }

/* 카드 객체: 패딩과 라운드만 정의 */
.c-card {
  border-radius: 16px;
  padding: 32px;
  border: 1px solid var(--line-border);
}

/* 버튼 객체: 기본 버튼의 물리적 형태 정의 */
.c-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 12px;
  padding: 20px;
  font-size: 18px;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.c-btn--full { width: 100%; }

/* ============================================================
   3. OOCSS Skins (시각적 스타일: 배경, 색상, 그림자)
   ============================================================ */
.c-card--shadow {
  background: var(--bg-white);
  box-shadow: 0 4px 20px rgba(0,0,0,0.04);
}

.c-btn--primary {
  background: var(--text-title);
  color: #fff;
}
.c-btn--primary:hover {
  background: var(--primary-orange);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 143, 0, 0.25);
}

/* ============================================================
   4. Utilities (보조 클래스)
   ============================================================ */
.u-mb-24 { margin-bottom: 24px; }
.u-mb-8 { margin-bottom: 8px; }
.u-sticky-top { position: sticky; top: 20px; height: fit-content; }

/* ============================================================
   5. 페이지 특정 컴포넌트 스타일
   ============================================================ */
.page-title { 
  font-size: 28px; font-weight: 800; margin-bottom: 30px; 
  border-bottom: 2px solid var(--text-title); padding-bottom: 15px; 
}

.checkout-grid { display: grid; grid-template-columns: 1.8fr 1fr; gap: 30px; }
.sec-title { font-size: 18px; font-weight: 800; margin-bottom: 24px; display: flex; align-items: center; gap: 8px; }

/* Form */
.input-group { margin-bottom: 20px; }
.label { display: block; font-size: 14px; font-weight: 700; color: var(--text-body); margin-bottom: 8px; }
.form-input {
  width: 100%; padding: 14px 16px; border: 1px solid var(--line-border);
  border-radius: 12px; background: #FAFAFA; font-size: 15px; outline: none; transition: 0.2s;
}
.form-input:focus { border-color: var(--primary-orange); background: #fff; }

/* Order Items */
.order-item { display: flex; gap: 16px; align-items: center; border-bottom: 1px solid #F3F4F6; padding-bottom: 16px; margin-bottom: 16px; }
.order-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
.item-thumb { width: 70px; height: 70px; border-radius: 10px; background: #eee; object-fit: cover; }
.item-info { flex: 1; }
.item-name { font-weight: 700; margin-bottom: 4px; font-size: 15px; }
.item-opt { font-size: 13px; color: #999; }
.item-price { font-weight: 800; }
.empty-msg { text-align: center; padding: 40px; color: #999; }

/* Summary Row */
.summary-row { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 15px; color: var(--text-body); font-weight: 600; }
.total-row { border-top: 2px solid var(--line-border); padding-top: 20px; margin-top: 20px; font-size: 20px; color: var(--text-title); }
.total-price-text { color: var(--primary-orange); font-weight: 800; font-size: 24px; }

/* Responsive */
@media (max-width: 900px) {
  .checkout-grid { grid-template-columns: 1fr; }
  .u-sticky-top { position: static; }
}
</style>