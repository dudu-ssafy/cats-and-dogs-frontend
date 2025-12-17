import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
  // 1. 상태 (State)
  const user = ref(null); // 로그인 유저 정보
  const isLogin = computed(() => user.value !== null);
  
  // 댕댕이 프로필 정보 (아기수첩 데이터)
  const petProfile = ref(null); 

  // 2. 기능 (Actions)
  
  // 로그인
  const login = (userData) => {
    user.value = {
      username: userData.username,
      nickname: userData.nickname,
      password: userData.password, // 수정 기능을 위해 비번도 일단 저장 (데모용)
      profileImg: 'https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?auto=format&fit=crop&w=100&q=80'
    };
    localStorage.setItem('user-info', JSON.stringify(user.value));
  };

  // ✅ [추가됨] 내 정보 수정 (닉네임, 비밀번호 등 변경 시 사용)
  const updateUser = (newUserData) => {
    if (user.value) {
        // 기존 유저 정보에 새로운 정보를 덮어쓰기 (Merge)
        user.value = { ...user.value, ...newUserData };
        // 로컬스토리지에도 업데이트해서 새로고침해도 유지되게 함
        localStorage.setItem('user-info', JSON.stringify(user.value));
    }
  };

  // 댕댕이 등록 (아기수첩 저장)
  const registerPet = (petData) => {
    petProfile.value = petData; 
    localStorage.setItem('pet-info', JSON.stringify(petProfile.value));
  };

  // 로그아웃
  const logout = () => {
    user.value = null;
    petProfile.value = null; 
    
    localStorage.removeItem('user-info');
    localStorage.removeItem('pet-info'); 
    
    location.reload(); 
  };

  // 새로고침 시 정보 복구
  const initUser = () => {
    // 유저 정보 복구
    const savedUser = localStorage.getItem('user-info');
    if (savedUser) {
        user.value = JSON.parse(savedUser);
    }

    // 댕댕이 정보 복구
    const savedPet = localStorage.getItem('pet-info');
    if (savedPet) {
        petProfile.value = JSON.parse(savedPet);
    }
  };

  return { 
    user, 
    isLogin, 
    petProfile, 
    login, 
    logout, 
    initUser, 
    registerPet, 
    updateUser // ✅ 수정 기능 사용을 위해 꼭 반환해야 함
  }
})