<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { shortsApi } from '@/api/shorts';
import ShortsItem from '@/components/ShortsItem.vue';
import ShortsComment from '@/components/ShortsComment.vue';

const videos = ref([]);
const showCommentDrawer = ref(false);
const selectedVideo = ref(null);
const activeVideoId = ref(null); // 🔥 현재 재생 중인 비디오 ID

onMounted(() => {
    fetchShorts();
});

const fetchShorts = async () => {
    try {
        const response = await shortsApi.getShorts();
        videos.value = response.data.map(item => ({
            id: item.id,
            username: item.author.nickname || item.author.username,
            userImg: item.author.profile_image || 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=100',
            videoUrl: item.video_url,
            desc: item.description || item.title,
            music: 'Original Sound - ' + (item.author.nickname || item.author.username),
            likes: item.likes_count,
            comments: item.comments_count,
            isLiked: item.is_liked,
            isFollowed: false 
        }));
        
        // 데이터 로드 후 옵저버 연결을 위해 nextTick 대기
        nextTick(() => {
            setupObserver();
        });

    } catch (error) {
        console.error('Failed to fetch shorts:', error);
    }
};

// 🔥 IntersectionObserver 설정 (영상 자동 재생/정지 제어)
const setupObserver = () => {
    const options = {
        root: document.querySelector('.video-scroll-container'),
        threshold: 0.6 // 60% 이상 보일 때 활성화
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // data-id 속성에서 비디오 ID 추출
                const id = Number(entry.target.dataset.id);
                activeVideoId.value = id;
                
                // 댓글창 상태 동기화 (선택 비디오 업데이트)
                const video = videos.value.find(v => v.id === id);
                if (video) selectedVideo.value = video;
            }
        });
    }, options);

    // 모든 비디오 아이템 관찰 시작
    document.querySelectorAll('.video-item-wrapper').forEach(el => observer.observe(el));
};

const toggleComments = (video) => {
    // 특정 비디오에서 열린 경우 선택 비디오 업데이트
    if (video) {
        selectedVideo.value = video; 
        showCommentDrawer.value = true;
    } else {
        // 단순히 토글인 경우 (닫기 등)
        showCommentDrawer.value = !showCommentDrawer.value;
    }
};

const toggleLike = async (video) => {
    try {
        const response = await shortsApi.toggleLike(video.id);
        video.isLiked = response.data.is_liked;
        video.likes = response.data.likes;
    } catch (error) {
        console.error('Failed to toggle like:', error);
        if (error.response?.status === 401) {
            alert('로그인이 필요합니다.');
        }
    }
};

const toggleFollow = (video) => {
    // TODO: 팔로우 API 연동
    video.isFollowed = !video.isFollowed;
};

// 자식 컴포넌트(ShortsComment)로부터 댓글 수 업데이트
const updateCommentCount = (count) => {
    if (selectedVideo.value) {
        selectedVideo.value.comments = count;
    }
};

const closeDrawer = () => {
    showCommentDrawer.value = false;
};
</script>

<template>
  <div class="shorts-bg-layer">
    <div class="center-wrapper">
        <div class="mobile-frame">
            <div class="video-scroll-container">
                <!-- 감지용 wrapper 추가 -->
                <div 
                    v-for="video in videos" 
                    :key="video.id"
                    class="video-item-wrapper"
                    :data-id="video.id" 
                    style="height: 100%; scroll-snap-align: start;"
                >
                    <ShortsItem 
                        :video="video"
                        :is-active="activeVideoId === video.id"
                        :is-comment-open="showCommentDrawer && selectedVideo?.id === video.id"
                        @toggle-like="toggleLike"
                        @toggle-follow="toggleFollow"
                        @toggle-comments="() => toggleComments(video)"
                    />
                </div>
            </div>
        </div>

        <ShortsComment 
            :is-open="showCommentDrawer"
            :video-id="selectedVideo?.id"
            :total-comments="selectedVideo?.comments || 0"
            @close="closeDrawer"
            @update:count="updateCommentCount"
        />
    </div>
  </div>
</template>

<style scoped>
/* 배경 및 레이아웃 */
.shorts-bg-layer { width: 100%; height: calc(100vh - 80px); background-color: #121212; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.center-wrapper { display: flex; align-items: center; height: 100%; max-height: 800px; gap: 0; }

/* 핸드폰 프레임 */
.mobile-frame { width: 400px; height: 100%; background: black; border-radius: 24px; position: relative; overflow: hidden; box-shadow: 0 0 50px rgba(0,0,0,0.5); z-index: 10; flex-shrink: 0; }
.video-scroll-container { width: 100%; height: 100%; overflow-y: scroll; scroll-snap-type: y mandatory; scrollbar-width: none; }
.video-scroll-container::-webkit-scrollbar { display: none; }
</style>
