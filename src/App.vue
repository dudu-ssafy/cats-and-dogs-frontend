<script setup>
import { RouterView, useRoute } from 'vue-router' // useRoute 추가
import TheHeader from '@/components/TheHeader.vue'
import TheFooter from '@/components/TheFooter.vue'

const route = useRoute(); // 현재 주소 정보 가져오기
</script>

<template>
  <TheHeader />

  <main>
    <RouterView />
  </main>

  <TheFooter v-if="$route.path !== '/ai'" />
</template>

<style>
/* 기존 스타일 그대로 유지 */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
* { box-sizing: border-box; margin: 0; padding: 0; }
body { 
  font-family: 'NanumSquareRound', sans-serif; 
  background-color: #F5F7FA;
}
</style>