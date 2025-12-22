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

  // 공통 유저 정보 업데이트 함수
  const setUserInfo = (userData, tokens = null) => {
    // 토큰이 인자로 넘어오면 저장 (로그인 시)
    if (tokens) {
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
    }

    // 기존의 access/refresh 토큰 유지 (프로필 조회 시)
    const access = tokens?.access || localStorage.getItem('access_token');
    const refresh = tokens?.refresh || localStorage.getItem('refresh_token');

    // 스토어 상태 업데이트
    user.value = {
      id: userData.id,
      username: userData.username,
      profileImg: userData.profile_image,
      access,
      refresh
    };

    // 로컬스토리지 저장
    localStorage.setItem('user-info', JSON.stringify(user.value));
  };

  const mypage = async () => {
    try {
      const response = await api.get('users/profile/');
      setUserInfo(response.data);
      return response.data;
    } catch (error) {
      console.error('Profile fetch failed:', error);
      throw error;
    }
  };

  const login = (userData) => {
    const { email, password } = userData;
    return api({
      method: 'post',
      url: 'users/login/',
      data: { email, password },
    })
      .then((response) => {
        const { token, user: userData } = response.data;
        setUserInfo(userData, token);
        return response.data;
      })
      .catch((error) => {
        console.error('Login failed:', error);
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
    mypage,
  }
})