<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/TheHeader.vue' // 방금 만든 헤더 가져오기
import TheFooter from './components/TheFooter.vue' // 방금 만든 푸터 가져오기
</script>

<template>
  <TheHeader />

  <main>
    <RouterView />
  </main>

  <TheFooter />
</template>

<style>
/* 전역 스타일 (폰트 등)은 여기서 한 번만 선언 */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { 
  font-family: 'Pretendard', 'NanumSquareRound', sans-serif; 
  background-color: #F5F7FA;
}
</style>