<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// 🔥 [추가] userStore 임포트 (가입 후 로그인 처리 시 필요할 수 있음)
import { useUserStore } from '@/stores/user'; 

const router = useRouter();
const userStore = useUserStore(); // 인스턴스 사용

const nickname = ref('');
const email = ref('');
const password = ref('');

const handleSignup = () => {
    if(!nickname.value || !email.value || !password.value) {
        alert('모든 항목을 입력해주세요.');
        return;
    }
    
    // 🔥 [수정] 회원가입 성공 후, 입력된 닉네임과 이메일로 자동 로그인 처리
    userStore.login({ 
        username: email.value,
        nickname: nickname.value // 🔥 [핵심] 입력된 닉네임을 스토어에 전달
    });

    alert(`반가워요, ${nickname.value}님! 회원가입 및 로그인이 완료되었습니다. 🐾`);
    router.push('/'); // 홈으로 이동 (또는 로그인 페이지로 이동)
};
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-container">
        <div class="auth-image">
            <div class="image-overlay">
                <p class="quote">"반가워요!<br>우리 아이 건강관리 시작해볼까요?"</p>
            </div>
        </div>

        <div class="auth-form-area">
            <div class="logo" @click="router.push('/')">함께하개<span>냥</span></div>
            <h1 class="title">회원가입</h1>

            <form @submit.prevent="handleSignup">
                <div class="input-group">
                    <span class="label">이름(닉네임)</span>
                    <input type="text" class="input-field" placeholder="집사님 이름을 알려주세요" v-model="nickname" required>
                </div>
                <div class="input-group">
                    <span class="label">이메일</span>
                    <input type="email" class="input-field" placeholder="example@email.com" v-model="email" required>
                </div>
                <div class="input-group">
                    <span class="label">비밀번호</span>
                    <input type="password" class="input-field" placeholder="영문, 숫자 포함 8자 이상" v-model="password" required>
                </div>
                
                <button type="submit" class="btn-submit">가입 완료하기</button>
            </form>

            <div class="divider"><span>간편 회원가입</span></div>

            <div class="social-row">
                <button class="btn-social-text">
                    <img src="https://cdn-icons-png.flaticon.com/512/3669/3669973.png" width="18"> 카카오
                </button>
                <button class="btn-social-text">
                    <img src="https://cdn-icons-png.flaticon.com/512/2991/2991148.png" width="18"> 구글
                </button>
            </div>

            <div class="bottom-link">
                이미 계정이 있으신가요? <router-link to="/login">로그인</router-link>
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
    --line-soft: #E0E0E0;
    --shadow-float: 0 20px 60px rgba(0,0,0,0.08);

    background-color: var(--bg-base);
    min-height: calc(100vh - 80px); 
    display: flex; align-items: center; justify-content: center;
    padding: 40px 0;
}

.auth-container {
    width: 1000px; height: 680px; 
    background: white; border-radius: 40px;
    box-shadow: var(--shadow-float);
    display: flex; overflow: hidden;
}

.auth-image {
    flex: 1;
    background-image: url('https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80');
    background-size: cover; background-position: center; position: relative;
}
.image-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.2); display: flex; flex-direction: column; 
    justify-content: flex-end; padding: 40px;
}
.quote { color: white; font-size: 24px; font-weight: 800; line-height: 1.4; text-shadow: 0 2px 10px rgba(0,0,0,0.3); }

.auth-form-area {
    flex: 1; padding: 50px 60px;
    display: flex; flex-direction: column; justify-content: center;
}
.logo { font-size: 24px; font-weight: 800; color: var(--text-title); margin-bottom: 8px; cursor: pointer; }
.logo span { color: var(--primary-honey); }
.title { font-size: 28px; font-weight: 900; margin-bottom: 32px; color: var(--text-title); }

.input-group { margin-bottom: 16px; }
.label { display: block; font-size: 13px; font-weight: 700; color: #666; margin-bottom: 6px; margin-left: 4px;}
.input-field {
    width: 100%; padding: 14px 20px; font-size: 15px;
    border: 2px solid var(--line-soft); border-radius: 12px;
    background: #FAFAFA; outline: none; transition: 0.3s; font-family: inherit;
}
.input-field:focus { border-color: var(--primary-honey); background: white; }

.btn-submit {
    width: 100%; padding: 16px; margin-top: 10px; margin-bottom: 24px;
    background: var(--primary-honey); color: white; font-size: 16px; font-weight: 800;
    border: none; border-radius: 12px; cursor: pointer; transition: 0.2s;
}
.btn-submit:hover { background: var(--primary-hover); }

.divider { display: flex; align-items: center; color: #AAA; font-size: 12px; margin-bottom: 20px; }
.divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--line-soft); }
.divider span { padding: 0 12px; }

.social-row { display: flex; gap: 12px; }
.btn-social-text {
    flex: 1; padding: 12px; border-radius: 12px; border: 1px solid var(--line-soft);
    background: white; font-size: 14px; font-weight: 700; color: #555;
    cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
    transition: 0.2s;
}
.btn-social-text:hover { background: #F5F5F5; }

.bottom-link { text-align: center; margin-top: 24px; font-size: 13px; color: #666; }
.bottom-link a { font-weight: 700; text-decoration: none; color: var(--text-title); border-bottom: 1px solid var(--text-title); margin-left: 6px;}
</style>