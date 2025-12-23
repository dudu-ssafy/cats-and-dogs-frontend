<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '@/api/index';

const route = useRoute();
const router = useRouter();

const status = ref(route.query.status || 'processing');
const merchantUid = ref(route.query.merchant_uid);
const taskId = ref(route.query.task_id);
const errorMsg = ref(route.query.error || '');

const orderInfo = ref(null);
const pollingInterval = ref(null);

const checkOrderStatus = async () => {
  if (!merchantUid.value) return;

  try {
    const response = await api.get(`/payments/status/?merchant_uid=${merchantUid.value}`);
    
    orderInfo.value = response.data;
    
    if (response.data.status === 'PAID') {
      status.value = 'success';
      stopPolling();
    } else if (response.data.status === 'FAILED') {
      status.value = 'fail';
      stopPolling();
    }
  } catch (error) {
    console.error('Failed to check order status:', error);
  }
};

const startPolling = () => {
  if (status.value === 'processing') {
    pollingInterval.value = setInterval(checkOrderStatus, 2000);
  }
};

const stopPolling = () => {
  if (pollingInterval.value) {
    clearInterval(pollingInterval.value);
    pollingInterval.value = null;
  }
};

onMounted(() => {
  if (status.value === 'processing') {
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
});

const goHome = () => router.push('/');
const goShop = () => router.push('/shop');
</script>

<template>
  <div class="payment-result-page">
    <div class="result-card">
      
      <!-- Processing State -->
      <div v-if="status === 'processing'" class="state-container">
        <div class="loader"></div>
        <h2>결제 승인 중...</h2>
        <p>잠시만 기다려주세요. 결제 처리를 마무리하고 있습니다.</p>
      </div>

      <!-- Success State -->
      <div v-else-if="status === 'success'" class="state-container success">
        <span class="material-icons-round status-icon">check_circle</span>
        <h2>결제가 완료되었습니다!</h2>
        <p>주문이 성공적으로 접수되었습니다. 이용해주셔서 감사합니다.</p>
        <div class="info-box" v-if="orderInfo">
          <div class="info-row"><span>주문번호</span> <span>{{ orderInfo.merchant_uid }}</span></div>
          <div class="info-row"><span>결제금액</span> <span>{{ orderInfo.total_amount.toLocaleString() }}원</span></div>
        </div>
        <button class="action-btn primary" @click="goHome">홈으로 가기</button>
      </div>

      <!-- Fail State -->
      <div v-else class="state-container fail">
        <span class="material-icons-round status-icon">cancel</span>
        <h2>결제에 실패했습니다</h2>
        <p>{{ errorMsg || '결제 과정에서 오류가 발생했습니다. 다시 시도해주세요.' }}</p>
        <div class="btn-group">
          <button class="action-btn secondary" @click="goShop">상점으로 돌아가기</button>
          <button class="action-btn primary" @click="goHome">홈으로 가기</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.payment-result-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;
  background-color: #f9fafb;
}

.result-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  max-width: 450px;
  width: 100%;
  text-align: center;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #FF8F00;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.status-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

.success .status-icon { color: #10B981; }
.fail .status-icon { color: #EF4444; }

h2 { margin-bottom: 12px; font-weight: 800; color: #111827; }
p { color: #6B7280; line-height: 1.5; margin-bottom: 24px; }

.info-box {
  width: 100%;
  background: #F3F4F6;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 14px;
}

.info-row:last-child { margin-bottom: 0; }
.info-row span:first-child { color: #9CA3AF; }
.info-row span:last-child { font-weight: 700; color: #374151; }

.action-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  border: none;
  transition: 0.2s;
}

.action-btn.primary { background: #111827; color: white; }
.action-btn.primary:hover { background: #FF8F00; }

.action-btn.secondary { background: #E5E7EB; color: #374151; margin-bottom: 12px; }
.action-btn.secondary:hover { background: #D1D5DB; }

.btn-group { width: 100%; }
</style>
