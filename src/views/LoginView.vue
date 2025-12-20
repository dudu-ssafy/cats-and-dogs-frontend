<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import api from '@/api';

const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
    if (!email.value || !password.value) {
        alert('이메일과 비밀번호를 모두 입력해주세요.');
        return;
    }

    try {
        // Backend login request
        const response = await api.post('users/login/', {
            email: email.value,
            password: password.value
        });

        const { access, refresh } = response.data;

        // Save tokens
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        // Fetch user profile (assuming a profile endpoint exists)
        const profileRes = await api.get('users/profile/', {
            headers: { Authorization: `Bearer ${access}` }
        });

        // Update Pinia store with actual user data
        userStore.login({ 
            username: profileRes.data.username,
            nickname: profileRes.data.username, // Using username as nickname as per UserDetailSerializer
            profileImg: profileRes.data.profile_image
        });

        alert(`로그인 성공! 환영합니다, ${userStore.user.username}님! 🐾`);
        router.push('/'); // Redirect to home
    } catch (error) {
        console.error('Login error:', error);
        alert('로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
    }
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-container">
        <div class="auth-image">
            <div class="image-overlay">
                <p class="quote">"오늘 하루,<br>우리 아이 기분은 어땠나요?"</p>
            </div>
        </div>

        <div class="auth-form-area">
            <div class="logo" @click="router.push('/')">함께하개<span>냥</span></div>
            <h1 class="title">로그인</h1>

            <form @submit.prevent="handleLogin">
                <div class="input-group">
                    <input 
                        type="email" 
                        class="input-field" 
                        placeholder="이메일 주소" 
                        v-model="email" 
                        required
                    >
                </div>
                <div class="input-group">
                    <input 
                        type="password" 
                        class="input-field" 
                        placeholder="비밀번호" 
                        v-model="password" 
                        required
                    >
                </div>
                <button type="submit" class="btn-submit">로그인</button>
            </form>

            <div class="divider"><span>또는 SNS로 시작하기</span></div>

            <div class="social-buttons">
                <button class="social-btn" title="Naver"><img src="/login-icon/NAVER_login_Light_KR_green_icon_H56.png" class="social-icon"></button>
                <button class="social-btn" title="Kakao"><img src="https://cdn-icons-png.flaticon.com/512/3669/3669973.png" class="social-icon"></button>
            </div>

            <div class="bottom-link">
                아직 회원이 아니신가요? <router-link to="/signup">회원가입</router-link>
            </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
/* (스타일은 변경 없음) */
.auth-wrapper {
    --bg-base: #FDFCF8;
    --primary-honey: #FFD54F;
    --primary-hover: #FFC107;
    --text-title: #2C2C2C;
    --text-body: #555555;
    --line-soft: #E0E0E0;
    --shadow-float: 0 20px 60px rgba(0,0,0,0.08);

    background-color: var(--bg-base);
    min-height: calc(100vh - 80px); /* 헤더 높이만큼 공간 확보 */
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
}
.auth-container {
    width: 1000px; height: 600px; background: white;
    border-radius: 40px; box-shadow: var(--shadow-float);
    display: flex; overflow: hidden;
}
.auth-image {
    flex: 1;
    background-image: url('https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
    background-size: cover; background-position: center; position: relative;
}
.image-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.2); display: flex; flex-direction: column; 
    justify-content: flex-end; padding: 40px;
}
.quote { color: white; font-size: 24px; font-weight: 800; line-height: 1.4; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }

.auth-form-area {
    flex: 1; padding: 60px; display: flex; flex-direction: column; justify-content: center;
}
.logo { font-size: 24px; font-weight: 800; color: var(--text-title); margin-bottom: 8px; cursor: pointer; }
.logo span { color: var(--primary-honey); }
.title { font-size: 32px; font-weight: 900; margin-bottom: 40px; color: var(--text-title); }

.input-group { margin-bottom: 20px; }
.input-field {
    width: 100%; padding: 16px 24px; font-size: 16px; border: 2px solid var(--line-soft);
    border-radius: 12px; background: #FAFAFA; outline: none; transition: 0.3s; font-family: inherit;
}
.input-field:focus { border-color: var(--primary-honey); background: white; }
.input-field::placeholder { color: #AAA; }

.btn-submit {
    width: 100%; padding: 18px; background: var(--primary-honey); color: white;
    font-size: 18px; font-weight: 800; border: none; border-radius: 12px; cursor: pointer;
    margin-top: 10px; margin-bottom: 30px; transition: 0.2s;
}
.btn-submit:hover { background: var(--primary-hover); transform: translateY(-2px); }

.divider { display: flex; align-items: center; color: #AAA; font-size: 13px; margin-bottom: 24px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--line-soft); }
.divider span { padding: 0 16px; }

.social-buttons { display: flex; justify-content: center; gap: 20px; }
.social-btn {
    width: 52px; height: 52px; border-radius: 50%; border: 1px solid var(--line-soft);
    background: white; display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: 0.2s;
}
.social-btn:hover { border-color: var(--text-body); transform: translateY(-2px); }
.social-icon { width: 24px; height: 24px; object-fit: contain; }

.bottom-link { text-align: center; margin-top: 32px; font-size: 14px; color: var(--text-body); }
.bottom-link a { font-weight: 700; text-decoration: none; color: var(--text-title); border-bottom: 1px solid var(--text-title); margin-left: 8px;}
</style>