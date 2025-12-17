<script setup>
import { ref, nextTick, onMounted } from 'vue'; // onMounted 추가
import { useRouter, useRoute } from 'vue-router'; // useRoute 추가
import DiagnosisCard from '@/components/DiagnosisCard.vue'; 

const router = useRouter();
const route = useRoute(); // ✅ [기능 추가] 현재 주소(데이터) 가져오기 위한 설정
const goHome = () => router.push('/');

// 상태 변수
const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const chatContentRef = ref(null);

// 사이드바 기록
const historyList = ref([
    { id: 1, title: '슬개골 탈구 의심 증상', active: false },
    { id: 2, title: '강아지 눈 충혈 분석', active: false },
]);

// ✅ [기능 추가] 페이지가 열릴 때 메인에서 보낸 데이터 확인
onMounted(() => {
    window.scrollTo(0, 0);

    // 주소창에 ?symptom=... 데이터가 있다면?
    if (route.query.symptom) {
        userInput.value = route.query.symptom; // 입력창에 값 채우기
        sendMessage(); // 바로 분석 시작
    }
});

// ✅ [새로운 진단 시작] 버튼 기능
const startNewChat = () => {
    if (messages.value.length > 0) {
        const firstMsg = messages.value.find(m => m.type === 'user');
        const title = firstMsg ? firstMsg.text : '새로운 진단 기록';
        historyList.value.unshift({ id: Date.now(), title: title, active: false });
    }
    messages.value = [];
    userInput.value = '';
    isLoading.value = false;
    
    // URL의 쿼리도 지워주는 게 깔끔함 (선택사항)
    router.replace({ query: null });
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
        if (text.includes("눈") || text.includes("충혈") || text.includes("아파") || text.includes("빨개")) {
            // 1. 텍스트 먼저
            messages.value.push({ type: 'ai', text: "증상을 분석하고 있습니다. 잠시만 기다려주세요..." });
            scrollToBottom();

            // 2. 진단 카드 (0.8초 뒤)
            setTimeout(() => {
                messages.value.push({ 
                    type: 'result', 
                    data: {
                        title: "결막염 (의심)",
                        engTitle: "Canine Conjunctivitis",
                        accuracy: 92,
                        description: `<strong>눈의 충혈</strong>과 불편함은 결막염의 주요 증상입니다.`,
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
    userInput.value = text;
    sendMessage();
};
</script>

<template>
  <div class="ai-container">
    
    <aside class="ai-sidebar">
        <div class="sidebar-logo" @click="goHome">
            <span class="material-icons-round logo-icon">pets</span>
            <span class="logo-text">함께하개냥</span>
        </div>
        <div class="sidebar-header">
            <div class="user-avatar"></div>
            <span class="user-name">최두용님</span>
        </div>

        <button class="btn-new-chat" @click="startNewChat">
            <span class="material-icons-round" style="color:var(--primary-honey)">add</span>
            새로운 진단 시작
        </button>

        <ul class="history-list">
            <li v-for="h in historyList" :key="h.id" class="history-item">
                <span class="material-icons-round history-icon">history</span> {{ h.title }}
            </li>
        </ul>
    </aside>

    <main class="chat-main">
        <div class="chat-header">함께하개냥 AI 닥터 <span class="ver-badge">Ver 2.0</span></div>

        <div class="welcome-screen" v-if="messages.length === 0">
            <div class="welcome-logo-area">
                <span class="material-icons-round welcome-icon">medical_services</span>
            </div>
            <h2 class="welcome-title">어디가 불편한가요?<br>사진이나 증상을 알려주세요.</h2>

            <div class="suggestion-grid">
                <div class="suggestion-card" @click="clickSuggestion('상처 부위 사진을 올릴게요')">
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
                    {{ msg.text }}
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
                <input type="text" class="chat-input" v-model="userInput" @keyup.enter="sendMessage" placeholder="증상을 입력하세요...">
                <button class="btn-send" @click="sendMessage">⬆</button>
            </div>
        </div>
    </main>
  </div>
</template>

<style scoped>
/* 기존 스타일 그대로 유지 */
.ai-container { display: flex; height: 100vh; overflow: hidden; color: #333; }
.ai-sidebar { width: 260px; background: #F9FAFB; padding: 20px; border-right: 1px solid #eee; display: flex; flex-direction: column; }
.sidebar-logo { display: flex; align-items: center; gap: 6px; font-size: 20px; font-weight: 800; color: #4A3F35; margin-bottom: 30px; cursor: pointer; }
.logo-icon { color: #FFD54F; font-size: 24px; }
.btn-new-chat { width: 100%; padding: 12px; background: white; border: 1px solid #E5E7EB; border-radius: 12px; color: #111827; font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s; margin-bottom: 24px; }
.btn-new-chat:hover { border-color: #FFD54F; background: #FFFDE7; }
.chat-main { flex: 1; display: flex; flex-direction: column; background: #fff; position: relative; }
.chat-content { flex: 1; overflow-y: auto; padding: 20px 40px 100px; }
.msg-row { display: flex; margin-bottom: 20px; }
.msg-row.user { justify-content: flex-end; }
.msg-bubble { padding: 10px 16px; border-radius: 12px; max-width: 70%; background: #eee; }
.msg-row.user .msg-bubble { background: #FFD54F; color: #fff; }
.input-area { position: absolute; bottom: 0; width: 100%; padding: 20px; background: white; }
.input-container { display: flex; gap: 10px; border: 1px solid #ddd; padding: 10px; border-radius: 20px; }
.chat-input { flex: 1; border: none; outline: none; }
.welcome-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 100px; }
.welcome-logo-area { width: 80px; height: 80px; background: #FFD54F; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; box-shadow: 0 10px 20px rgba(255, 213, 79, 0.3); }
.welcome-icon { font-size: 40px; color: white; }
.welcome-title { font-size: 24px; font-weight: 800; margin-bottom: 40px; text-align: center; }

/* 그리드 레이아웃 */
.suggestion-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 700px; width: 100%; padding: 0 20px; }
.suggestion-card { border: 1px solid #E5E7EB; border-radius: 20px; padding: 16px 20px; cursor: pointer; transition: 0.2s; background: white; }
.suggestion-card:hover { border-color: #FFD54F; background: #FFFDE7; transform: translateY(-2px); }
.sug-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;}
.sug-desc { font-size: 13px; color: #6B7280; }

/* 기타 스타일 생략 (필요시 기존 코드 사용) */
.history-list { list-style: none; overflow-y: auto; flex: 1; }
.history-item { padding: 10px 12px; border-radius: 8px; font-size: 14px; color: #6B7280; cursor: pointer; display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
.history-item:hover { background: #E5E7EB; color: #111827; }
.chat-header { height: 60px; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; padding: 0 32px; font-weight: bold; }
.ver-badge { font-size: 12px; background: #F3F4F6; padding: 4px 8px; border-radius: 6px; color: #666; margin-left: 6px; font-weight: normal; }
.sidebar-header { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #E5E7EB; }
.user-avatar { width: 32px; height: 32px; border-radius: 50%; background: #ddd; background-size: cover; background-image: url('https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'); }
.user-name { font-size: 14px; font-weight: 700; }
.history-icon { font-size: 16px; color: #9CA3AF; }
.btn-send { width: 40px; height: 40px; border-radius: 50%; background: #FFD54F; color: white; border: none; cursor: pointer; }
.msg-bubble.loading span { display: inline-block; animation: bounce 1.4s infinite ease-in-out both; font-size: 20px; margin: 0 2px; }
@keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }
</style>