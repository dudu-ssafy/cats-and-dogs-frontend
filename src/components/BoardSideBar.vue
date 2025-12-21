<script setup>
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const props = defineProps({
    currentCategory: {
        type: String,
        default: 'all'
    }
});

const emit = defineEmits(['category-change']);

const router = useRouter();
const userStore = useUserStore();

const setCategory = (category) => {
    emit('category-change', category);
};
</script>

<template>
    <aside class="sidebar">
        <div class="login-card">
            <template v-if="userStore.isLogin && userStore.user">
                <div 
                    class="profile-thumb" 
                    :style="{ backgroundImage: `url(${userStore.user.profileImg || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'})` }"
                    @click="router.push('/my-profile')"
                ></div>
                <p class="login-msg welcome-text">
                    <span style="font-size: 20px;">👋</span> 반가워요!<br>
                    <span style="color:#F57F17; font-weight:800">{{ userStore.user.nickname || userStore.user.username }}</span>님 🐾
                </p>
                
                <div class="user-activities">
                    <div 
                        class="activity-link" 
                        :class="{ active: currentCategory === 'my-posts' }"
                        @click="setCategory('my-posts')"
                    >
                        <span class="material-icons-round">article</span> 내가 쓴 글
                    </div>
                    <div 
                        class="activity-link" 
                        :class="{ active: currentCategory === 'liked-posts' }"
                        @click="setCategory('liked-posts')"
                    >
                        <span class="material-icons-round">favorite_border</span> 내가 좋아요한 글
                    </div>
                </div>

            </template>
            <template v-else>
                <div style="font-size:32px; margin-bottom:8px;">👋</div>
                <p class="login-msg">로그인하고<br>집사들과 소통해보세요!</p>
                <button class="btn-login-sidebar" @click="router.push('/login')">로그인 / 회원가입</button>
            </template>
        </div>

        <div class="menu-group">
            <div class="menu-head">
                <span v-if="userStore.isLogin && userStore.user">
                    {{ userStore.user.nickname || userStore.user.username }}님의 게시판
                </span>
                <span v-else>
                    게시판
                </span>
            </div>
            <ul class="menu-list">
                <li :class="{ active: currentCategory === 'all' }" @click="setCategory('all')">
                    <span class="material-icons-round menu-icon">format_list_bulleted</span> 전체글
                </li>
                <li :class="{ active: currentCategory === 'hot' }" @click="setCategory('hot')">
                    <span class="material-icons-round menu-icon">local_fire_department</span> 인기글 <span class="hot-badge">HOT</span>
                </li>
                <li :class="{ active: currentCategory === 'free' }" @click="setCategory('free')">
                    <span class="material-icons-round menu-icon">chat_bubble_outline</span> 자유 수다
                </li>
                <li :class="{ active: currentCategory === 'qna' }" @click="setCategory('qna')">
                    <span class="material-icons-round menu-icon">help_outline</span> 질문/답변
                </li>
                <li :class="{ active: currentCategory === 'info' }" @click="setCategory('info')">
                    <span class="material-icons-round menu-icon">tips_and_updates</span> 정보 공유
                </li>
            </ul>
        </div>
    </aside>
</template>

<style scoped>
.sidebar { width: 220px; flex-shrink: 0; }
.login-card { background: white; padding: 24px 20px; border: 1px solid #EAEAEA; border-radius: 20px; text-align: center; margin-bottom: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.profile-thumb { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; background-color: #EEE; border: 3px solid #FFD54F; margin: 0 auto 12px; background-size: cover; background-position: center; cursor: pointer; }
.welcome-text { margin-bottom: 20px !important; font-size: 14px; color: #5D5D5D; font-weight: 700; line-height: 1.5; }
.login-msg { font-size: 14px; color: #5D5D5D; margin-bottom: 16px; font-weight: 700; }
.btn-login-sidebar { display: block; width: 100%; padding: 12px; background: #FFD54F; color: white; font-weight: 800; border-radius: 12px; cursor: pointer; border: none; transition: 0.2s; }
.btn-login-sidebar:hover { background: #FFC107; }

.user-activities { border-top: 1px dashed #EAEAEA; padding-top: 16px; display: flex; flex-direction: column; gap: 8px; text-align: left; }
.activity-link { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #5D5D5D; font-weight: 600; padding: 4px 8px; border-radius: 6px; transition: 0.2s; cursor: pointer; }
.activity-link:hover, .activity-link.active { background: #FFFDE7; color: #FFC107; }
.activity-link .material-icons-round { font-size: 18px; color: #FFB300; }

.menu-group { margin-bottom: 32px; }
.menu-head { font-size: 13px; font-weight: 800; color: #CCC; margin-bottom: 12px; padding-left: 12px; }
.menu-list { list-style: none; padding: 0; margin: 0; }
.menu-list li { padding: 12px 16px; font-size: 15px; font-weight: 700; color: #5D5D5D; border-radius: 12px; cursor: pointer; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
.menu-list li:hover { background: #FFFDE7; color: #F57F17; }
.menu-list li.active { background: #FFFDE7; color: #F57F17; font-weight: 800; }
.hot-badge { background: #FF5252; color: white; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-left: auto; }
.menu-icon { font-size: 20px; }

@media (max-width: 1024px) {
    .sidebar { width: 100%; }
    .menu-list { display: flex; flex-wrap: wrap; gap: 8px; }
    .menu-list li { flex: 1; min-width: 100px; justify-content: center; }
    .login-card { margin-bottom: 16px; }
}
</style>
