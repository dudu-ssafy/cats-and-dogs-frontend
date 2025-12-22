<script setup>
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router'; 

const router = useRouter();
const userStore = useUserStore();
const pet = userStore.petProfile;
const goBack = () => router.back();
</script>

<template>
  <div class="license-layout">
    <header class="license-top">
      <button class="close-btn" @click="goBack">✕</button>
    </header>

    <div class="c-license-card s-bg-beige">
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
            <div class="c-item"><label>보호자</label> <span>{{ pet?.ownerNickname }}</span></div>
          </div>
          
          <div class="c-address-row">
            <label>연락처</label> <span>{{ pet?.contact}}</span>
          </div>
          <div class="c-address-row">
            <label>주소</label> <span>{{ pet?.address }}</span>
          </div>

          <div class="u-footer-text">
            2025.12.26 함께하개냥
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
@import url('https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap');

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
  /* ✅ [수정] flex-start에서 center로 변경하여 세로 중앙 정렬 */
  align-items: center; 
}

.o-grid-info {
  display: grid;
  grid-template-columns: auto 1fr; 
  gap: 12px 15px;
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
  border-radius: 20px;
  box-sizing: border-box;
  position: relative; 
  border: 2px solid #a58d7b; 
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
}

.c-license-card::after {
  content: '';
  position: absolute;
  top: 12px; left: 12px; right: 12px; bottom: 12px;
  border: 1px solid rgba(165, 141, 123, 0.4);
  border-radius: 12px;
  pointer-events: none;
}

.c-info-side { flex: 1; }

.c-item label, .c-address-row label {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 15px;
  font-weight: 800;
  color: #222;
  min-width: 75px; 
  margin-right: 10px;
  letter-spacing: 0.5px;
}

.c-item span, .c-address-row span {
  font-family: 'Pretendard', sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: #000;
  white-space: nowrap;
}

.c-address-row { margin-top: 8px; }

/* =========================================
   3. Skins & Utilities (외형 및 유틸리티)
   ========================================= */
.s-bg-beige {
  background-color: #F3E5DC;
}

.u-title {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: 8px; 
  margin: 0 0 10px 0;
  color: #000;
}

.u-pet-name {
  font-family: 'Pretendard', sans-serif;
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}

.u-footer-text {
  font-family: 'Nanum Myeongjo', serif;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: 2px;
  text-align: center;
  margin-top: 40px;
}

.close-btn { background: none; border: none; font-size: 30px; cursor: pointer; color: #333; }
.u-text-center { text-align: center; }
.u-mb-m { margin-bottom: 35px; }

.u-photo {
  width: 220px; height: 200px; object-fit: cover; border-radius: 5px;
  border: 1px solid #d1bba9;
}
</style>