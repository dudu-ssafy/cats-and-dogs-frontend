<script setup>
import { ref, onMounted } from 'vue';
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

onMounted(() => {
    fetchHistory();
});

defineExpose({
    fetchHistory
});
</script>

<template>
    <aside class="ai-sidebar">
        <div class="sidebar-logo" @click="goHome">
            <span class="material-icons-round logo-icon">pets</span>
            <span class="logo-text">함께하개냥</span>
        </div>
        
        <div class="sidebar-header">
            <div class="user-avatar" :style="{ backgroundImage: 'url(' + (userStore.user?.profileImg || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80') + ')' }"></div>
            <span class="user-name">{{ userStore.user?.username || '집사' }}님</span>
        </div>

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
    </aside>
</template>

<style scoped>
.ai-sidebar { 
    width: 260px; 
    background: #F9FAFB; 
    padding: 20px; 
    border-right: 1px solid #eee; 
    display: flex; 
    flex-direction: column; 
    height: 100%;
}

.sidebar-logo { 
    display: flex; 
    align-items: center; 
    gap: 6px; 
    font-size: 20px; 
    font-weight: 800; 
    color: #4A3F35; 
    margin-bottom: 30px; 
    cursor: pointer; 
}

.logo-icon { 
    color: #FFD54F; 
    font-size: 24px; 
}

.sidebar-header { 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    margin-bottom: 24px; 
    padding-bottom: 20px; 
    border-bottom: 1px solid #E5E7EB; 
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

/* Material Icons for fallback */
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
</style>