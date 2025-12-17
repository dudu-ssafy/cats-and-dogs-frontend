<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

// 결제하기 버튼 클릭 시 (테스트용)
const handlePayment = () => {
    if(confirm('42,900원을 결제하시겠습니까?')) {
        alert('결제가 완료되었습니다! 쿨거래 감사합니다 🐶');
        router.push('/'); // 메인으로 이동
    }
};
</script>

<template>
    <div class="order-page">
        <div class="container">
            <h1 class="page-title">주문/결제</h1>

            <div class="checkout-grid">
                
                <div class="left-col">
                    <section class="section-card">
                        <h3 class="sec-title"><span class="material-icons-round">local_shipping</span>배송지 정보</h3>
                        
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
                            <input type="text" class="form-input" placeholder="우편번호 찾기" style="margin-bottom:8px;">
                            <input type="text" class="form-input" placeholder="상세 주소를 입력하세요">
                        </div>
                        <div class="input-group">
                            <label class="label">배송 메모</label>
                            <input type="text" class="form-input" placeholder="예: 문 앞에 놔주세요.">
                        </div>
                    </section>

                    <section class="section-card">
                        <h3 class="sec-title"><span class="material-icons-round">shopping_bag</span>주문 상품 (1개)</h3>
                        
                        <div class="order-item">
                            <img src="https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=100&q=80" class="item-thumb">
                            <div class="item-info">
                                <p class="item-name">프리미엄 유기농 강아지 사료 2kg</p>
                                <p class="item-opt">옵션: 피부/알러지 케어</p>
                            </div>
                            <div class="item-price">39,900원</div>
                        </div>
                    </section>
                </div>

                <div class="right-col sticky-summary">
                    <section class="section-card">
                        <h3 class="sec-title"><span class="material-icons-round">receipt_long</span>결제 금액</h3>
                        
                        <div class="summary-row">
                            <span>총 상품금액</span>
                            <span>39,900원</span>
                        </div>
                        <div class="summary-row">
                            <span>배송비</span>
                            <span>3,000원</span>
                        </div>
                        <div class="summary-row total">
                            <span>최종 결제금액</span>
                            <span class="total-price-text">42,900원</span>
                        </div>

                        <button class="btn-pay" @click="handlePayment">결제하기</button>
                    </section>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
/* 디자인 시스템 변수 (이 컴포넌트 내에서만 유효) */
.order-page {
    --bg-body: #F5F7FA;
    --bg-white: #FFFFFF;
    --primary-orange: #FF8F00;
    --text-title: #111827;
    --text-body: #4B5563;
    --line-border: #E5E7EB;
    --radius-card: 16px;
    --shadow-card: 0 4px 20px rgba(0,0,0,0.04);
    
    background-color: var(--bg-body);
    min-height: 100vh;
    padding-bottom: 100px;
    color: var(--text-title);
    font-family: 'NanumSquareRound', sans-serif;
}

.container { max-width: 1100px; margin: 0 auto; padding: 40px; }

.page-title { 
    font-size: 28px; font-weight: 800; margin-bottom: 30px; 
    border-bottom: 2px solid var(--text-title); padding-bottom: 15px; 
}

.checkout-grid {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 30px;
}

/* 카드 스타일 */
.section-card {
    background: var(--bg-white);
    border-radius: var(--radius-card);
    box-shadow: var(--shadow-card);
    padding: 32px;
    margin-bottom: 24px;
    border: 1px solid var(--line-border);
}

.sec-title { 
    font-size: 18px; font-weight: 800; margin-bottom: 20px; 
    display: flex; align-items: center; gap: 8px; 
}

/* 입력 폼 */
.input-group { margin-bottom: 20px; }
.label { display: block; font-size: 14px; font-weight: 700; color: var(--text-body); margin-bottom: 8px; }
.form-input {
    width: 100%; padding: 14px 16px;
    border: 1px solid var(--line-border);
    border-radius: 12px;
    background: #FAFAFA;
    font-size: 15px; color: var(--text-title);
    font-family: inherit;
}
.form-input:focus {
    border-color: var(--primary-orange);
    background: #fff;
    outline: none;
    box-shadow: 0 0 0 3px rgba(255, 143, 0, 0.1);
}

/* 주문 상품 리스트 */
.order-item { 
    display: flex; gap: 16px; align-items: center; 
    border-bottom: 1px solid #F3F4F6; padding-bottom: 16px; margin-bottom: 16px; 
}
.item-thumb { width: 70px; height: 70px; border-radius: 10px; background: #eee; object-fit: cover; }
.item-info { flex: 1; }
.item-name { font-weight: 700; margin-bottom: 4px; font-size: 15px; }
.item-opt { font-size: 13px; color: #999; }
.item-price { font-weight: 800; }

/* Sticky Summary */
.sticky-summary { position: sticky; top: 20px; height: fit-content; }

.summary-row { 
    display: flex; justify-content: space-between; margin-bottom: 16px; 
    font-size: 15px; color: var(--text-body); font-weight: 600; 
}
.summary-row.total {
    border-top: 2px solid var(--line-border);
    padding-top: 20px; margin-top: 20px;
    font-size: 20px; color: var(--text-title);
}
.total-price-text { color: var(--primary-orange); font-weight: 800; }

/* 버튼 */
.btn-pay {
    width: 100%; padding: 20px;
    background: var(--text-title);
    color: #fff;
    border: none; border-radius: 12px;
    font-size: 18px; font-weight: 800; cursor: pointer; margin-top: 20px;
    font-family: inherit; transition: 0.2s;
}
.btn-pay:hover {
    background: var(--primary-orange);
    box-shadow: 0 8px 20px rgba(255, 143, 0, 0.25);
    transform: translateY(-2px);
}

/* 모바일 반응형 */
@media (max-width: 768px) {
    .checkout-grid { grid-template-columns: 1fr; }
    .sticky-summary { position: static; }
}
</style>