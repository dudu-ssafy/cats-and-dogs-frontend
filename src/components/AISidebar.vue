<script setup>
import { ref, onMounted, computed, watch } from 'vue'; // watch 추가
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import api from '@/api';

const props = defineProps({
    currentSessionId: {
        type: Number,
        default: null
    }
});

const emit = defineEmits(['select-session', 'new-chat']);

const router = useRouter();
const userStore = useUserStore();
const historyList = ref([]);
const goHome = () => router.push('/');

// ✅ [디버깅 & 연동 로직] 
const userProfileImg = computed(() => {
    // 1. 데이터가 어떻게 들어오는지 브라우저 콘솔(F12)에서 확인하기 위함
    console.log("현재 스토어의 유저 정보:", userStore.user);

    const imgPath = userStore.user?.profileImg || userStore.user?.profile_img || userStore.user?.image;
    
    if (!imgPath) {
        return 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80';
    }

    if (imgPath.startsWith('http')) {
        return imgPath;
    }
    
    // 2. 경로가 '/media/'로 시작하는지 확인하고 서버 주소 붙이기
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    // 경로 앞에 /가 중복되지 않게 처리
    const cleanPath = imgPath.startsWith('/') ? imgPath : `/${imgPath}`;
    return `${baseUrl}${cleanPath}`;
});

const fetchHistory = async () => {
    try {
        const response = await api.get('chats/');
        historyList.value = response.data;
    } catch (error) {
        console.error('Failed to fetch chat history:', error);
    }
};

const handleNewChat = () => {
    emit('new-chat');
};

const selectSession = (sessionId) => {
    emit('select-session', sessionId);
};

onMounted(async () => {
    // 유저 정보가 아예 없는 경우 다시 한번 시도
    if (!userStore.user && typeof userStore.fetchUser === 'function') {
        await userStore.fetchUser();
    }
    fetchHistory();
});

defineExpose({
    fetchHistory
});
</script>

<template>
    <aside class="ai-sidebar">
        <div class="sidebar-header">
            <div class="user-avatar" :style="{ backgroundImage: `url('${userProfileImg}')` }"></div>
            <span class="user-name">{{ userStore.user?.username || userStore.user?.nickname || '집사' }}님</span>
        </div>

        <div class="sidebar-content">
            <button class="btn-new-chat" @click="handleNewChat">
                <span class="material-icons-round" style="color:var(--primary-honey)">add</span>
                새로운 진단 시작
            </button>

            <ul class="history-list">
                <li 
                    v-for="h in historyList" 
                    :key="h.id" 
                    class="history-item"
                    :class="{ active: currentSessionId === h.id }"
                    @click="selectSession(h.id)"
                >
                    <span class="material-icons-round history-icon">history</span> 
                    <span class="history-title">{{ h.title || '진단 기록' }}</span>
                </li>
            </ul>
        </div>
    </aside>
</template>

<style scoped>
/* 디자인 절대 수정 금지 - 사용자님 선 맞춤 스타일 유지 */
.ai-sidebar { 
    width: 260px; 
    background: #F9FAFB; 
    padding: 0; 
    border-right: 1px solid #eee; 
    display: flex; 
    flex-direction: column; 
    height: 100%;
}

.sidebar-header { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    height: 60px; 
    padding: 0 20px;
    border-bottom: 1px solid #E5E7EB; 
    box-sizing: border-box;
}

.sidebar-content {
    padding: 24px 20px;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
}

.user-avatar { 
    width: 32px; 
    height: 32px; 
    border-radius: 50%; 
    background: #ddd; 
    background-size: cover; 
    background-position: center; 
}

.user-name { 
    font-size: 14px; 
    font-weight: 700; 
}

.btn-new-chat { 
    width: 100%; 
    padding: 12px; 
    background: white; 
    border: 1px solid #E5E7EB; 
    border-radius: 12px; 
    color: #111827; 
    font-weight: 700; 
    font-size: 14px; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    cursor: pointer; 
    transition: 0.2s; 
    margin-bottom: 24px; 
}

.btn-new-chat:hover { 
    border-color: #FFD54F; 
    background: #FFFDE7; 
}

.history-list { 
    list-style: none; 
    overflow-y: auto; 
    flex: 1; 
    padding: 0;
    margin: 0;
}

.history-item { 
    padding: 10px 12px; 
    border-radius: 8px; 
    font-size: 13px; 
    color: #6B7280; 
    cursor: pointer; 
    display: flex; 
    align-items: center; 
    gap: 8px; 
    margin-bottom: 4px; 
    transition: 0.2s;
}

.history-item:hover { 
    background: #F3F4F6; 
    color: #111827; 
}

.history-item.active {
    background: #FFFDE7;
    color: #4A3F35;
    font-weight: 600;
}

.history-icon { 
    font-size: 16px; 
    color: #9CA3AF; 
}

.history-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
</style>