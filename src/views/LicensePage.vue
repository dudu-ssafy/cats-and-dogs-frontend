<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const userStore = useUserStore();

// ✅ Store에서 정보를 가져옵니다.
const pet = userStore.petProfile;

// ✅ 뒤로가기 시 이전 페이지(마이프로필)로 돌아감
const goBack = () => router.back();
</script>

<template>
  <div class="license-layout">
    <header class="license-top">
      <button class="close-btn" @click="goBack">✕</button>
    </header>

    <div class="c-license-card s-bg-gray">
      <div class="o-flex-container">
        
        <div class="c-info-side">
          <div class="u-text-center u-mb-m">
            <h2 class="u-title">반려동물등록증</h2>
            <p class="u-pet-name">{{ pet?.petName }}</p>
          </div>

          <div class="o-grid-info">
            <div class="c-item"><label>생년월일</label> <span>{{ pet?.birthdate }}</span></div>
            <div class="c-item"><label>성별</label> <span>{{ pet?.gender }}</span></div>
            <div class="c-item"><label>품종</label> <span>{{ pet?.breed }}</span></div>
            <div class="c-item"><label>중성화여부</label> <span>{{ pet?.neutered }}</span></div>
            <div class="c-item"><label>연락처</label> <span>{{ pet?.contact }}</span></div>
            <div class="c-item"><label>보호자</label> <span>{{ pet?.ownerNickname }}</span></div>
          </div>
          
          <div class="c-address-row">
            <label>주소</label> <span>{{ pet?.address }}</span>
          </div>

          <div class="u-footer-text">
            2025.11.15 함께하개냥
          </div>
        </div>

        <div class="c-image-side">
          <img :src="pet?.petImgUrl" class="u-photo" alt="반려견 사진">
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
/* =========================================
   1. Objects (구조 및 레이아웃)
   ========================================= */
.license-layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 20px;
}

.o-flex-container {
  display: flex;
  gap: 30px;
  align-items: flex-start;
}

.o-grid-info {
  display: grid;
  grid-template-columns: 1fr 1.2fr; /* 2열 구조 */
  gap: 12px 20px;
  margin-bottom: 12px;
}

/* =========================================
   2. Components (구성 요소)
   ========================================= */
.license-top {
  width: 100%;
  max-width: 700px;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
}

.c-license-card {
  width: 100%;
  max-width: 650px;
  padding: 45px 50px;
  border-radius: 25px;
  box-sizing: border-box;
}

.c-info-side {
  flex: 1;
}

.c-item, .c-address-row {
  font-size: 16px;
  color: #000;
  text-align: left;
}

.c-item label, .c-address-row label {
  font-weight: 500;
  display: inline-block;
  min-width: 65px;
  margin-right: 10px;
}

.c-address-row {
  margin-top: 5px;
}

/* =========================================
   3. Skins & Utilities (외형 및 유틸리티)
   ========================================= */
.s-bg-gray {
  background-color: #D9D9D9; /* 이미지와 동일한 회색 배경 */
}

.close-btn {
  background: none;
  border: none;
  font-size: 30px;
  cursor: pointer;
  color: #333;
}

.u-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
}

.u-pet-name {
  font-size: 20px;
  margin: 0;
}

.u-photo {
  width: 220px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px; /* 사진 모서리 살짝 둥글게 */
}

.u-text-center { text-align: center; }
.u-mb-m { margin-bottom: 35px; }

.u-footer-text {
  margin-top: 40px;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
}
</style>