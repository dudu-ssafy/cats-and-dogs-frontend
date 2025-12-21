<script setup>
import { ref, nextTick, onMounted, computed } from 'vue'; 
import { useRouter, useRoute } from 'vue-router'; 
import { useUserStore } from '@/stores/user'; 
import DiagnosisCard from '@/components/DiagnosisCard.vue'; 
import AISidebar from '@/components/AISidebar.vue';

import api from '@/api';
import { marked } from 'marked';
const router = useRouter();
const route = useRoute(); 
const userStore = useUserStore();
const goHome = () => router.push('/');

// 상태 변수
const messages = ref([]);
const userInput = ref('');
const isLoading = ref(false);
const chatContentRef = ref(null);
const currentSessionId = ref(null);
const sidebarRef = ref(null);
const fileInputRef = ref(null);

// 페이지 진입 시 로직
onMounted(() => {
    window.scrollTo(0, 0);

    if (route.query.symptom) {
        userInput.value = route.query.symptom; 
        sendMessage(); 
    }
});

const startNewChat = () => {
    messages.value = [];
    userInput.value = '';
    isLoading.value = false;
    currentSessionId.value = null;
    router.replace({ query: null });
};

const selectSession = async (sessionId) => {
    try {
        currentSessionId.value = sessionId;
        const response = await api.get(`chats/${sessionId}/`);
        messages.value = response.data.history.map(m => ({
            type: m.role === 'user' ? 'user' : 'ai',
            text: m.content
        }));
        scrollToBottom();
    } catch (error) {
        console.error('Failed to load session:', error);
    }
};

// 1. 파일 업로드 창 열기
const triggerFileInput = () => {
    fileInputRef.value.click();
};

// 2. 이미지 선택 시 처리 (미리보기 추가 및 전송)
const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 미리보기용 메시지 추가
    const reader = new FileReader();
    reader.onload = (e) => {
        messages.value.push({ 
            type: 'user', 
            text: '', 
            image: e.target.result // Base64 미리보기 주소
        });
        scrollToBottom();
    };
    reader.readAsDataURL(file);

    // 즉시 AI에게 전송
    isLoading.value = true;
    await fetchAiResponse("", file); 
    
    // 파일 인풋 초기화 (같은 파일 다시 올릴 수 있게)
    event.target.value = '';
};

const sendMessage = async () => {
    if(!userInput.value.trim()) return;
    messages.value.push({ type: 'user', text: userInput.value });
    const text = userInput.value;
    userInput.value = '';
    scrollToBottom();

    isLoading.value = true;
    await fetchAiResponse(text);
};

// ✅ [핵심 수정] 파라미터에 file 추가 및 FormData 대응
const fetchAiResponse = async (text, file = null) => {
    const history = messages.value.slice(0, -1)
        .filter(m => m.type !== 'result') // 결과 카드는 히스토리에서 제외
        .map(m => ({
            role: m.type === 'user' ? 'user' : 'model',
            content: m.text || ''
        }));

    let currentAiMsg = { type: 'ai', text: '' };
    messages.value.push(currentAiMsg);
    scrollToBottom();

    try {
        const token = localStorage.getItem('access_token');
        
        // 이미지 유무에 따른 요청 방식 분기
        let response;
        if (file) {
            const formData = new FormData();
            formData.append('prompt', text);
            formData.append('image', file);
            if (currentSessionId.value) formData.append('chat_id', currentSessionId.value);
            formData.append('history', JSON.stringify(history));

            response = await fetch(`${import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8001/'}chat/image`, {
                method: 'post',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });
        } else {
            response = await fetch(`${import.meta.env.VITE_AI_API_BASE_URL || 'http://localhost:8001/'}chat/text`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    prompt: text,
                    chat_id: currentSessionId.value,
                    history: history
                })
            });
        }

        if (!response.ok) throw new Error('AI 응답을 가져오는데 실패했습니다.');

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            let chunk = decoder.decode(value, { stream: true });
            
            if (chunk.includes('[CHAT_ID]:')) {
                const parts = chunk.split('[CHAT_ID]:');
                chunk = parts[0]; // ID 부분 제외한 텍스트만 남김
                currentSessionId.value = parseInt(parts[1].trim());
            }

            if (chunk.includes('---')) {
                const parts = chunk.split('---');
                currentAiMsg.text += parts[0];

                for (let i = 1; i < parts.length; i++) {
                    const newMsg = { type: 'ai', text: parts[i] };
                    messages.value.push(newMsg);
                    currentAiMsg = newMsg; // 포인터를 새 말풍선으로 변경
                }
            } else {
                // 일반 텍스트는 현재 말풍선에 계속 추가
                currentAiMsg.text += chunk;
            }
            scrollToBottom();
        }

        if (sidebarRef.value) sidebarRef.value.fetchHistory();

    } catch (error) {
        console.error('AI API Error:', error);
        currentAiMsg.text = '죄송합니다. 서비스 연결에 문제가 발생했습니다.';
    } finally {
        isLoading.value = false;
        scrollToBottom();
    }
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

const renderMarkdown = (text) => {
    return marked.parse(text);
};

</script>

<template>
  <div class="ai-container">
    <AISidebar 
        ref="sidebarRef"
        :currentSessionId="currentSessionId" 
        @select-session="selectSession"
        @new-chat="startNewChat"
    />

    <main class="chat-main">
        <div class="chat-header">함께하개냥 AI 닥터 <span class="ver-badge">Ver 2.0</span></div>

        <div class="welcome-screen" v-if="messages.length === 0">
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
                
                <div class="msg-bubble" v-if="msg.type === 'user'">
                    <img v-if="msg.image" :src="msg.image" class="msg-img" />
                    <span v-if="msg.text">{{ msg.text }}</span>
                </div>

                <div class="msg-bubble markdown-body" v-else-if="msg.type === 'ai'" v-html="renderMarkdown(msg.text)">
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
/* 기존 스타일 그대로 유지 */
.ai-container { display: flex; height: 100vh; overflow: hidden; color: #333; }
.chat-main { flex: 1; display: flex; flex-direction: column; background: #fff; position: relative; }
.chat-content { flex: 1; overflow-y: auto; padding: 20px 40px 100px; }
.msg-row { display: flex; margin-bottom: 20px; }
.msg-row.user { justify-content: flex-end; }
.msg-bubble { padding: 10px 16px; border-radius: 12px; max-width: 70%; background: #eee; overflow: hidden; }
.msg-row.user .msg-bubble { background: #FFD54F; color: #4A3F35; font-weight: 500; }
.msg-img { max-width: 100%; max-height: 300px; border-radius: 8px; display: block; margin-bottom: 5px; }

.input-area { position: absolute; bottom: 0; width: 100%; padding: 20px; background: white; }
.input-container { display: flex; gap: 10px; border: 1px solid #ddd; padding: 8px 15px; border-radius: 25px; align-items: center; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
.chat-input { flex: 1; border: none; outline: none; font-size: 15px; }
.btn-attach { background: none; border: none; cursor: pointer; color: #9CA3AF; display: flex; align-items: center; transition: color 0.2s; }
.btn-attach:hover { color: #FFD54F; }
.btn-send { width: 36px; height: 36px; border-radius: 50%; background: #FFD54F; color: white; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
.welcome-screen { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding-bottom: 100px; }
.welcome-title { font-size: 24px; font-weight: 800; margin-bottom: 40px; text-align: center; }
.suggestion-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 700px; width: 100%; padding: 0 20px; }
.suggestion-card { border: 1px solid #E5E7EB; border-radius: 20px; padding: 16px 20px; cursor: pointer; transition: 0.2s; background: white; }
.suggestion-card:hover { border-color: #FFD54F; background: #FFFDE7; transform: translateY(-2px); }
.sug-title { font-size: 14px; font-weight: 700; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;}
.sug-desc { font-size: 13px; color: #6B7280; }
.chat-header { height: 60px; border-bottom: 1px solid #E5E7EB; display: flex; align-items: center; padding: 0 32px; font-weight: bold; }
.ver-badge { font-size: 12px; background: #F3F4F6; padding: 4px 8px; border-radius: 6px; color: #666; margin-left: 6px; font-weight: normal; }
.btn-send { width: 40px; height: 40px; border-radius: 50%; background: #FFD54F; color: white; border: none; cursor: pointer; }

/* Markdown Styles */
.markdown-body :deep(h1) { margin-top: 24px; margin-bottom: 16px; font-weight: 900; color: #1A1A1A; font-size: 22px; padding-bottom: 8px; border-bottom: 2px solid #FFD54F; }
.markdown-body :deep(h2) { margin-top: 20px; margin-bottom: 12px; font-weight: 800; color: #2C2C2C; font-size: 18px; }
.markdown-body :deep(h3) { margin-top: 16px; margin-bottom: 10px; font-weight: 700; color: #3A3A3A; font-size: 16px; }
.markdown-body :deep(p) { margin-bottom: 16px; line-height: 1.8; color: #333; font-size: 15px; letter-spacing: -0.2px; }
.markdown-body :deep(ul), .markdown-body :deep(ol) { padding-left: 28px; margin-bottom: 16px; line-height: 1.8; }
.markdown-body :deep(li) { margin-bottom: 10px; color: #333; }
.markdown-body :deep(li::marker) { color: #FFD54F; }
.markdown-body :deep(strong) { color: #1A1A1A; background: linear-gradient(to top, #FFD54F 30%, transparent 30%); font-weight: 700; padding: 0 2px; }
.markdown-body :deep(code) { background: #FFF9E6; padding: 3px 6px; border-radius: 4px; font-family: 'Courier New', monospace; color: #D97706; font-size: 14px; }
.markdown-body :deep(blockquote) { border-left: 4px solid #FFD54F; padding-left: 16px; padding-top: 8px; padding-bottom: 8px; color: #666; font-style: italic; margin: 16px 0; background: #FAFAFA; border-radius: 4px; }
.markdown-body :deep(hr) { border: none; border-top: 2px dashed #E5E7EB; margin: 20px 0; }
.markdown-body :deep(em) { color: #666; font-style: italic; }
</style>