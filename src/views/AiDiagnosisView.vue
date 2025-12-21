<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'; 
import { useRouter, useRoute } from 'vue-router'; 
import { useUserStore } from '@/stores/user'; // ✅ 사용자 정보 스토어 임포트
import DiagnosisCard from '@/components/DiagnosisCard.vue'; 

const router = useRouter();
const route = useRoute(); 
const userStore = useUserStore(); // ✅ 스토어 인스턴스화
const goHome = () => router.push('/');

// 상태 변수
const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const chatContentRef = ref(null);
const fileInputRef = ref(null); 

// ✅ 마이페이지와 동일한 프로필 이미지를 가져오기 위한 computed
const userProfileImg = computed(() => userStore.petProfile?.petImgUrl || '');

// 사이드바 기록
const historyList = ref([
    { id: 1, title: '슬개골 탈구 의심 증상', active: false },
    { id: 2, title: '강아지 눈 충혈 분석', active: false },
]);

// 페이지 진입 시 로직
onMounted(() => {
    window.scrollTo(0, 0);

    if (route.query.symptom) {
        userInput.value = route.query.symptom; 
        sendMessage(); 
    }
});

// 새로운 진단 시작
const startNewChat = () => {
    if (messages.value.length > 0) {
        const firstMsg = messages.value.find(m => m.type === 'user');
        const title = firstMsg ? (firstMsg.text || '사진 분석 기록') : '새로운 진단 기록';
        historyList.value.unshift({ id: Date.now(), title: title, active: false });
    }
    messages.value = [];
    userInput.value = '';
    isLoading.value = false;
    router.replace({ query: null });
};

// 사진 업로드 핸들러
const triggerFileInput = () => {
    fileInputRef.value.click();
};

const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imageUrl = e.target.result;
            messages.value.push({ type: 'user', imageUrl: imageUrl });
            scrollToBottom();
            
            isLoading.value = true;
            fetchAiResponse("사진 분석 요청"); 
        };
        reader.readAsDataURL(file);
    }
    event.target.value = '';
};

// 메시지 전송
const sendMessage = async () => {
    if(!userInput.value.trim()) return;
    messages.value.push({ type: 'user', text: userInput.value });
    const text = userInput.value;
    userInput.value = '';
    scrollToBottom();

    isLoading.value = true;
    await fetchAiResponse(text);
};

// AI 응답 로직
const fetchAiResponse = async (text) => {
    setTimeout(() => {
        if (text.includes("눈") || text.includes("충혈") || text.includes("아파") || text.includes("빨개") || text.includes("사진")) {
            messages.value.push({ type: 'ai', text: "이미지 및 증상을 분석하고 있습니다. 잠시만 기다려주세요..." });
            scrollToBottom();

            setTimeout(() => {
                messages.value.push({ 
                    type: 'result', 
                    data: {
                        title: "결막염 (의심)",
                        engTitle: "Canine Conjunctivitis",
                        accuracy: 92,
                        description: `분석 결과, <strong>눈의 충혈</strong>과 불편함이 관찰되었습니다. 이는 결막염의 전형적인 증상입니다.`,
                        solutions: ["넥카라 착용", "인공눈물 세정", "지속 시 내원"]
                    }
                });
                isLoading.value = false;
                scrollToBottom();
            }, 800);
        } else {
            messages.value.push({ type: 'ai', text: "증상을 더 자세히 말씀해 주세요. (예: 눈이 빨개요)" });
            isLoading.value = false;
            scrollToBottom();
        }
    }, 800);
};

const scrollToBottom = async () => {
    await nextTick();
    if(chatContentRef.value) chatContentRef.value.scrollTop = chatContentRef.value.scrollHeight;
};

const clickSuggestion = (text) => {
    if (text.includes('사진')) {
        triggerFileInput();
    } else {
        userInput.value = text;
        sendMessage();
    }
};
</script>

<template>
  <div class="ai-container">
    
    <aside class="ai-sidebar">
        <div class="sidebar-header">
            <div 
                class="user-avatar" 
                :style="{ backgroundImage: userProfileImg ? `url(${userProfileImg})` : '' }"
            ></div>
            <span class="user-name">{{ userStore.user?.nickname || '사용자' }}님</span>
        </div>

        <div class="sidebar-content">
            <button class="btn-new-chat" @click="startNewChat">
                <span class="material-icons-round" style="color:var(--primary-honey)">add</span>
                새로운 진단 시작
            </button>

            <ul class="history-list">
                <li v-for="h in historyList" :key="h.id" class="history-item">
                    <span class="material-icons-round history-icon">history</span> {{ h.title }}
                </li>
            </ul>
        </div>
    </aside>

    <main class="chat-main">
        <div class="chat-header">함께하개냥 AI 닥터 <span class="ver-badge">Ver 2.0</span></div>

        <div class="welcome-screen" v-if="messages.length === 0">
            <div class="welcome-logo-area">
                <span class="material-icons-round welcome-icon">medical_services</span>
            </div>
            <h2 class="welcome-title">어디가 불편한가요?<br>사진이나 증상을 알려주세요.</h2>

            <div class="suggestion-grid">
                <div class="suggestion-card" @click="clickSuggestion('사진을 업로드할게요')">
                    <div class="sug-title">📷 사진으로 진단하기</div>
                    <div class="sug-desc">상처 부위나 눈, 피부 사진을 찍어 올려주세요.</div>
                </div>
                <div class="suggestion-card" @click="clickSuggestion('강아지가 다리를 절어요')">
                    <div class="sug-title">🦵 관절/보행 이상</div>
                    <div class="sug-desc">"강아지가 한쪽 다리를 들고 걸어요"</div>
                </div>
                <div class="suggestion-card" @click="clickSuggestion('노란 토를 했어요')">
                    <div class="sug-title">🤢 소화/배변 문제</div>
                    <div class="sug-desc">"노란토를 하는데 병원 가야 할까요?"</div>
                </div>
                <div class="suggestion-card" @click="clickSuggestion('눈이 충혈됐어요')">
                    <div class="sug-title">👀 안과 질환</div>
                    <div class="sug-desc">"눈곱이 많이 끼고 충혈됐어요"</div>
                </div>
            </div>
        </div>

        <div class="chat-content" v-else ref="chatContentRef">
            <div v-for="(msg, i) in messages" :key="i" :class="['msg-row', msg.type === 'user' ? 'user' : 'ai']">
                
                <div class="msg-bubble" v-if="msg.type === 'user' || msg.type === 'ai'">
                    <template v-if="msg.imageUrl">
                        <img :src="msg.imageUrl" alt="uploaded" class="msg-img" />
                    </template>
                    <template v-else>
                        {{ msg.text }}
                    </template>
                </div>

                <div v-else-if="msg.type === 'result'" style="width: 100%;">
                    <DiagnosisCard :data="msg.data" />
                </div>
            </div>

            <div class="msg-row ai" v-if="isLoading">
                <div class="msg-bubble loading">...</div>
            </div>
        </div>

        <div class="input-area">
            <div class="input-container">
                <input type="file" ref="fileInputRef" style="display: none" accept="image/*" @change="handleImageUpload">
                <button class="btn-attach" @click="triggerFileInput" title="사진 업로드">
                    <span class="material-icons-round">add_photo_alternate</span>
                </button>
                
                <input type="text" class="chat-input" v-model="userInput" @keyup.enter="sendMessage" placeholder="증상을 입력하세요...">
                <button class="btn-send" @click="sendMessage">⬆</button>
            </div>
        </div>
    </main>
  </div>
</template>

<style scoped>
/* 레이아웃 구성 */
.ai-container { display: flex; height: 100vh; overflow: hidden; color: #333; }

/* 사이드바 스타일 (상단 회색선 정렬) */
.ai-sidebar { width: 260px; background: #F9FAFB; border-right: 1px solid #eee; display: flex; flex-direction: column; }

/* ✅ 사이드바 헤더: 우측 채팅 헤더 높이(60px)와 선을 일치시킴 */
.sidebar-header { 
    height: 60px; 
    padding: 0 20px; 
    display: flex; 
    align-items: center; 
    gap: 10px; 
    border-bottom: 1px solid #E5E7EB; 
    background-color: #F9FAFB;
    box-sizing: border-box;
}
.sidebar-content { padding: 24px 20px; flex: 1; display: flex; flex-direction: column; }

/* 메인 채팅 영역 */
.chat-main { flex: 1; display: flex; flex-direction: column; background: #fff; position: relative; }
.chat-content { flex: 1; overflow-y: auto; padding: 20px 40px 100px; }

/* 메시지 버블 스타일 */
.msg-row { display: flex; margin-bottom: 20px; }
.msg-row.user { justify-content: flex-end; }
.msg-bubble { padding: 10px 16px; border-radius: 12px; max-width: 70%; background: #eee; overflow: hidden; }
.msg-row.user .msg-bubble { background: #FFD54F; color: #4A3F35; font-weight: 500; }
.msg-img { max-width: 100%; max-height: 300px; border-radius: 8px; display: block; }

/* 하단 입력창 */
.input-area { position: absolute; bottom: 0; width: 100%; padding: 20px; background: white; }
.input-container { display: flex; gap: 10px; border: 1px solid #ddd; padding: 8px 15px; border-radius: 25px; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.chat-input { flex: 1; border: none; outline: none; font-size: 15px; }

/* 버튼 스타일 */
.btn-attach { background: none; border: none; cursor: pointer; color: #9CA3AF; display: flex; align-items: center; transition: color 0.2s; }
.btn-attach:hover { color: #FFD54F; }
.btn-send { width: 36px; height: 36px; border-radius: 50%; background: #FFD54F; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }

/* 웰컴 스크린 */
.welcome-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 100px; }
.welcome-logo-area { width: 80px; height: 80px; background: #FFD54F; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 10px 20px rgba(255, 213, 79, 0.3); }
.welcome-icon { font-size: 40px; color: white; }
.welcome-title { font-size: 24px; font-weight: 800; margin-bottom: 40px; text-align: center; }

.suggestion-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 700px; width: 100%; padding: 0 20px; }
.suggestion-card { border: 1px solid #E5E7EB; border-radius: 20px; padding: 16px 20px; cursor: pointer; transition: 0.2s; background: white; }
.suggestion-card:hover { border-color: #FFD54F; background: #FFFDE7; transform: translateY(-2px); }
.sug-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;}
.sug-desc { font-size: 13px; color: #6B7280; }

/* 사이드바 리스트 및 기타 */
.btn-new-chat { width: 100%; padding: 12px; background: white; border: 1px solid #E5E7EB; border-radius: 12px; color: #111827; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; margin-bottom: 24px; }
.btn-new-chat:hover { border-color: #FFD54F; background: #FFFDE7; }
.history-list { list-style: none; overflow-y: auto; flex: 1; }
.history-item { padding: 10px 12px; border-radius: 8px; font-size: 14px; color: #6B7280; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.history-item:hover { background: #E5E7EB; color: #111827; }

.chat-header { height: 60px; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; padding: 0 32px; font-weight: bold; }
.ver-badge { font-size: 12px; background: #F3F4F6; padding: 4px 8px; border-radius: 6px; color: #666; margin-left: 6px; font-weight: normal; }

/* 사용자 아바타 스타일 */
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: #ddd; background-size: cover; background-position: center; border: 1px solid #eee; }
.user-name { font-size: 14px; font-weight: 700; color: #4A3F35; }
.history-icon { font-size: 16px; color: #9CA3AF; }
</style>