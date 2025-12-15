import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 1. 상태 (State)
  const user = ref(null); // 로그인 전에는 null
  const isLogin = computed(() => user.value !== null); // 로그인 여부 확인

  // 2. 기능 (Actions)
  
  // 로그인 함수 수정: 닉네임(nickname)을 인자로 받아 사용합니다.
  const login = (userData) => {
    // userData는 { username: 'email', nickname: '히히' } 형태가 됩니다.
    user.value = {
      username: userData.username,
      nickname: userData.nickname, // 🔥 [수정] 고정값 대신 전달받은 닉네임 사용
      profileImg: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=100&q=80' // 기본 이미지
    };
    // 새로고침 해도 로그인 유지되게 저장
    localStorage.setItem('user-info', JSON.stringify(user.value));
  };

  // 로그아웃
  const logout = () => {
    user.value = null;
    localStorage.removeItem('user-info');
    location.reload(); // 깔끔하게 새로고침
  };

  // 새로고침 했을 때 로그인 정보 복구
  const initUser = () => {
    const saved = localStorage.getItem('user-info');
    if (saved) {
        user.value = JSON.parse(saved);
    }
  };

  return { user, isLogin, login, logout, initUser }
})