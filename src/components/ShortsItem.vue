<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
    video: {
        type: Object,
        required: true
    },
    isCommentOpen: {
        type: Boolean,
        default: false
    },
    isActive: { // 🔥 재생 상태 제어용 prop 추가
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['toggle-like', 'toggle-follow', 'toggle-comments']);
const videoRef = ref(null);

// isActive 변경 감지하여 재생/일시정지
import { watch } from 'vue';
watch(() => props.isActive, (active) => {
    if (active) {
        videoRef.value?.play();
    } else {
        videoRef.value?.pause();
        if (videoRef.value) videoRef.value.currentTime = 0; // 선택사항: 정지 시 처음으로
    }
});

const togglePlay = (event) => {
    const videoEl = event.target;
    if (videoEl.paused) {
        videoEl.play();
    } else {
        videoEl.pause();
    }
};

const onToggleLike = () => {
    console.log('ShortsItem: toggle-like clicked', props.video.id);
    emit('toggle-like', props.video);
};
</script>

<template>
    <div class="video-item">
        <video 
            ref="videoRef"
            class="full-video"
            :src="video.videoUrl"
            loop
            muted
            playsinline
            @click="togglePlay"
        ></video>

        <div class="video-overlay"></div>

        <div class="info-area">
            <div class="profile-row">
                <img :src="video.userImg" class="thumb">
                <span class="name">{{ video.username }}</span>
                
                <button 
                    class="btn-follow" 
                    :class="{ 'following': video.isFollowed }"
                    @click.stop="emit('toggle-follow', video)"
                >
                    {{ video.isFollowed ? '팔로잉' : '팔로우' }}
                </button>
            </div>
            <div class="desc-text" v-html="video.desc"></div>
            <div class="music-row">
                <span class="material-icons-round note-icon">music_note</span>
                <span class="music-text">{{ video.music }}</span>
            </div>
        </div>

        <div class="side-actions">
            <button class="act-btn" :class="{ active: video.isLiked }" @click.stop="onToggleLike">
                <span class="material-icons-round icon">favorite</span>
                <span class="cnt">{{ video.likes }}</span>
            </button>

            <button class="act-btn" @click="emit('toggle-comments')" :class="{ active: isCommentOpen }">
                <span class="material-icons-round icon">mode_comment</span>
                <span class="cnt">{{ video.comments }}</span>
            </button>
            
            <button class="act-btn">
                <span class="material-icons-round icon">share</span>
                <span class="cnt">공유</span>
            </button>

            <div class="disk-ani">
                <img :src="video.userImg">
            </div>
        </div>
    </div>
</template>

<style scoped>
.video-item { position: relative; width: 100%; height: 100%; }
.full-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.video-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); pointer-events: none; }

/* 정보 영역 */
.info-area { position: absolute; bottom: 20px; left: 16px; width: 75%; color: white; z-index: 10; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
.profile-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.thumb { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #fff; }
.name { font-weight: 700; font-size: 15px; }

/* 팔로우 버튼 스타일 */
.btn-follow { 
    background: transparent; 
    border: 1px solid white; 
    color: white; 
    border-radius: 4px; 
    padding: 3px 10px; 
    font-size: 11px; 
    font-weight: 700; 
    cursor: pointer; 
    transition: 0.2s;
}
.btn-follow.following {
    background: rgba(255, 255, 255, 0.2);
    border-color: transparent;
    color: #FFD54F;
}

.desc-text { font-size: 14px; line-height: 1.4; margin-bottom: 8px; }
.music-row { display: flex; align-items: center; gap: 6px; font-size: 12px; }

/* 우측 버튼 */
.side-actions { position: absolute; bottom: 30px; right: 10px; display: flex; flex-direction: column; align-items: center; gap: 20px; z-index: 10; }
.act-btn { background: none; border: none; color: white; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: 0.2s; }
.act-btn:hover { transform: scale(1.1); }
.act-btn.active .icon { color: #FF5252; }
.act-btn .icon { font-size: 30px; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5)); }
.act-btn .cnt { font-size: 12px; font-weight: 600; margin-top: 2px; text-shadow: 0 1px 2px rgba(0,0,0,0.8); }

.disk-ani { width: 44px; height: 44px; background: #222; border-radius: 50%; border: 8px solid #111; margin-top: 20px; animation: spin 4s linear infinite; }
.disk-ani img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>
