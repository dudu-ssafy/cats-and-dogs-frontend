<script setup>
import { ref, watch, defineProps, defineEmits } from 'vue';
import { shortsApi } from '@/api/shorts';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    videoId: {
        type: Number,
        default: null
    },
    totalComments: {
        type: Number,
        default: 0
    }
});

const emit = defineEmits(['close', 'update:count']);

const comments = ref([]);
const newComment = ref('');
const isLoading = ref(false);

// videoId가 변경되거나 창이 열릴 때 댓글 목록 조회
watch(
    [() => props.videoId, () => props.isOpen],
    async ([newId, newOpen]) => {
        if (newOpen && newId) {
            await fetchComments(newId);
        }
    }
);

const fetchComments = async (id) => {
    isLoading.value = true;
    try {
        const response = await shortsApi.getShortsDetail(id);
        comments.value = response.data.comments || [];
    } catch (error) {
        console.error('Failed to fetch comments:', error);
    } finally {
        isLoading.value = false;
    }
};

const submitComment = async () => {
    if (!newComment.value.trim() || !props.videoId) return;

    try {
        await shortsApi.createComment(props.videoId, newComment.value);
        newComment.value = ''; // 입력창 초기화
        
        // 댓글 목록 갱신 및 부모에게 카운트 업데이트 알림
        await fetchComments(props.videoId);
        emit('update:count', comments.value.length);

    } catch (error) {
        console.error('Failed to submit comment:', error);
        if (error.response?.status === 401) {
            alert('로그인이 필요합니다.');
        }
    }
};
</script>

<template>
    <div class="side-drawer" :class="{ open: isOpen }">
        <div class="drawer-inner">
            <div class="drawer-head">
                <span>댓글 {{ totalComments }}</span>
                <span class="material-icons-round close-btn" @click="$emit('close')">close</span>
            </div>
            
            <div class="drawer-body">
                <div v-if="isLoading" class="loading-msg">로딩중...</div>
                
                <div v-else-if="comments.length > 0">
                    <div class="cmt-row" v-for="comment in comments" :key="comment.id">
                        <img :src="comment.author?.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'" class="cmt-pf">
                        <div class="cmt-data">
                            <div class="cmt-usr">
                                {{ comment.author?.username || '익명' }} 
                                <span class="time">{{ new Date(comment.created_at).toLocaleDateString() }}</span>
                            </div>
                            <div class="cmt-msg">{{ comment.content }}</div>
                        </div>
                    </div>
                </div>

                <div v-else class="empty-msg">
                    첫 댓글을 남겨보세요!
                </div>
            </div>

            <div class="drawer-input">
                <input 
                    type="text" 
                    placeholder="댓글 입력..." 
                    class="inp" 
                    v-model="newComment"
                    @keyup.enter="submitComment"
                >
                <button class="send" @click="submitComment">게시</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.side-drawer { width: 0; height: 100%; background: white; border-radius: 0 24px 24px 0; overflow: hidden; transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 10px 0 30px rgba(0,0,0,0.3); }
.side-drawer.open { width: 360px; border-left: 1px solid #eee; }
.drawer-inner { width: 360px; height: 100%; display: flex; flex-direction: column; }
.drawer-head { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid #eee; font-size: 15px; font-weight: 800; color: #333; }
.close-btn { cursor: pointer; color: #999; }
.drawer-body { flex: 1; overflow-y: auto; padding: 0 16px; }
.loading-msg, .empty-msg { padding: 40px; text-align: center; color: #999; font-size: 14px; }

.cmt-row { display: flex; gap: 10px; padding: 16px 0; border-bottom: 1px solid #f9f9f9; }
.cmt-pf { width: 32px; height: 32px; background: #ddd; border-radius: 50%; flex-shrink: 0; object-fit: cover; }
.cmt-data { flex: 1; }
.cmt-usr { font-size: 12px; font-weight: 700; color: #555; margin-bottom: 2px; }
.cmt-usr .time { font-weight: 400; color: #aaa; margin-left: 4px; font-size: 11px; }
.cmt-msg { font-size: 13px; color: #333; line-height: 1.3; }

.drawer-input { height: 70px; border-top: 1px solid #eee; display: flex; align-items: center; padding: 0 16px; gap: 10px; background: #fff; }
.inp { flex: 1; background: #F3F4F6; border: none; height: 40px; border-radius: 20px; padding: 0 16px; font-size: 14px; outline: none; }
.send { background: none; border: none; color: #FFD54F; font-weight: 700; font-size: 14px; cursor: pointer; }
</style>
