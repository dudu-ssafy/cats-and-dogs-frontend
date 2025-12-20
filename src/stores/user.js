import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/api'

export const useUserStore = defineStore('user', () => {
  // 1. 상태 (State)
  const user = ref(null); // 로그인 유저 정보
  const isLogin = computed(() => user.value !== null);
  
  // 댕댕이 프로필 정보 (아기수첩 데이터)
  const petProfile = ref(null); 

  const signup = (userData) => {
    const { username, email, password } = userData;
    return api({
      method: 'post',
      url: 'users/signup/',
      data: {
        username,
        email,
        password,
      },
    })
      .then((response) => {
      console.log(response.data);
      return login({
        email,
        password,
      });
    })
    .catch((error) => {
      console.error(error.response.data);
      throw error;
    });
  };

  const login = (userData) => {
    const { email, password } = userData;
    return api({
      method: 'post',
      url: 'users/login/',
      data: {
        email,
        password,
      },
    })
    .then((response) => {
      console.log(response.data); 
      const { token, user: userData } = response.data;
      
      localStorage.setItem('access_token', token.access);
      localStorage.setItem('refresh_token', token.refresh);
      
      // Update store state
      user.value = {
        id: userData.id,
        username: userData.username,
        profileImg: userData.profile_image,
        access: token.access,
        refresh: token.refresh
      };

      localStorage.setItem('user-info', JSON.stringify(user.value));
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
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
    updateUser, // ✅ 수정 기능 사용을 위해 꼭 반환해야 함
    signup,
  }
})