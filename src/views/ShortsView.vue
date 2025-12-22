<script setup>
import { ref, onMounted } from 'vue';
import { shortsApi } from '@/api/shorts';

const videos = ref([]);

const fetchShorts = async () => {
    try {
        const response = await shortsApi.getShorts();
        videos.value = response.data.map(video => ({
            id: video.id,
            username: video.author.username || 'Anonymous',
            userImg: video.author.profile_image || 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
            videoUrl: video.video_url,
            desc: video.description || video.title,
            music: video.title || 'Original Sound',
            likes: video.likes_count,
            comments: video.comments_count,
            isLiked: video.is_liked,
        }));
        if (videos.value.length > 0) {
            selectedVideo.value = videos.value[0];
        }
    } catch (error) {
        console.error('Failed to fetch shorts:', error);
    }
};

onMounted(() => {
    fetchShorts();
});

const showCommentDrawer = ref(false);
const selectedVideo = ref(null);
const newComment = ref('');

const toggleComments = async (video) => {
    if (video) {
        selectedVideo.value = video;
        if (!showCommentDrawer.value) {
            await fetchComments(video);
        }
    }
    showCommentDrawer.value = !showCommentDrawer.value;
};

const submitComment = async () => {
    if (!newComment.value.trim() || !selectedVideo.value) return;
    
    try {
        await shortsApi.createComment(selectedVideo.value.id, newComment.value);
        
        // 댓글 작성 후 목록 갱신을 위해 상세 정보를 다시 가져옴
        const response = await shortsApi.getShortsDetail(selectedVideo.value.id);
        selectedVideo.value.commentList = response.data.comments;
        selectedVideo.value.comments = response.data.comments.length;
        
        newComment.value = ''; // 입력창 초기화
    } catch (error) {
        console.error('Failed to submit comment:', error);
        if (error.response?.status === 401) {
            alert('댓글을 작성하려면 로그인이 필요합니다.');
        }
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
            alert('좋아요를 누르려면 로그인이 필요합니다.');
        }
    }
};

const togglePlay = (event) => {
    const videoEl = event.target;
    if (videoEl.paused) {
        videoEl.play();
    } else {
        videoEl.pause();
    }
};

const handleScroll = (event) => {
    const container = event.target;
    const index = Math.round(container.scrollTop / container.clientHeight);
    const activeVideo = videos.value[index];

    if (activeVideo && (!selectedVideo.value || selectedVideo.value.id !== activeVideo.id)) {
        selectedVideo.value = activeVideo;
        
        // 댓글창이 열려있다면 새 영상의 댓글을 불러옴
        if (showCommentDrawer.value) {
            fetchComments(activeVideo);
        }
    }
};

const fetchComments = async (video) => {
    try {
        const response = await shortsApi.getShortsDetail(video.id);
        video.commentList = response.data.comments;
        video.comments = response.data.comments.length;
    } catch (error) {
        console.error('Failed to fetch comments:', error);
    }
};
</script>

<template>
  <div class="shorts-bg-layer">
    
    <div class="center-wrapper">
        
        <div class="mobile-frame">
            <div class="video-scroll-container" @scroll="handleScroll">
                <div 
                    v-for="video in videos" 
                    :key="video.id" 
                    class="video-item"
                >
                    <video 
                        class="full-video"
                        :src="video.videoUrl"
                        loop
                        muted
                        autoplay
                        playsinline
                        @click="togglePlay"
                    ></video>

                    <div class="video-overlay"></div>

                    <div class="info-area">
                        <div class="profile-row">
                            <img :src="video.userImg" class="thumb">
                            <span class="name">{{ video.username }}</span>
                            
                           
                        </div>
                        <div class="desc-text" v-html="video.desc"></div>
                        <div class="music-row">
                            <span class="material-icons-round note-icon">music_note</span>
                            <span class="music-text">{{ video.music }}</span>
                        </div>
                    </div>

                    <div class="side-actions">
                        <button class="act-btn" :class="{ active: video.isLiked }" @click="toggleLike(video)">
                            <span class="material-icons-round icon">favorite</span>
                            <span class="cnt">{{ video.likes }}</span>
                        </button>
                        
                        <button class="act-btn" @click="toggleComments(video)" :class="{ active: showCommentDrawer && selectedVideo?.id === video.id }">
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
            </div>
        </div>

        <div class="side-drawer" :class="{ open: showCommentDrawer }">
            <div class="drawer-inner">
                <div class="drawer-head">
                    <span>댓글 {{ selectedVideo?.comments }}</span>
                    <span class="material-icons-round close-btn" @click="toggleComments(null)">close</span>
                </div>
                
                <div class="drawer-body">
                    <div v-if="selectedVideo?.commentList && selectedVideo.commentList.length > 0">
                        <div class="cmt-row" v-for="comment in selectedVideo.commentList" :key="comment.id">
                            <img :src="comment.author.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80'" class="cmt-pf">
                            <div class="cmt-data">
                                <div class="cmt-usr">{{ comment.author.username }} <span class="time">{{ new Date(comment.created_at).toLocaleString() }}</span></div>
                                <div class="cmt-msg">{{ comment.content }}</div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="empty-msg" style="padding: 40px; text-align: center; color: #999;">
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
.video-item { width: 100%; height: 100%; position: relative; scroll-snap-align: start; background: #000; }
.full-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.video-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); pointer-events: none; }

/* 정보 영역 */
.info-area { position: absolute; bottom: 20px; left: 16px; width: 75%; color: white; z-index: 10; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
.profile-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.thumb { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #fff; }
.name { font-weight: 700; font-size: 15px; }





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

/* 사이드 댓글창 */
.side-drawer { width: 0; height: 100%; background: white; border-radius: 0 24px 24px 0; overflow: hidden; transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); box-shadow: 10px 0 30px rgba(0,0,0,0.3); }
.side-drawer.open { width: 360px; border-left: 1px solid #eee; }
.drawer-inner { width: 360px; height: 100%; display: flex; flex-direction: column; }
.drawer-head { height: 50px; display: flex; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid #eee; font-size: 15px; font-weight: 800; color: #333; }
.close-btn { cursor: pointer; color: #999; }
.drawer-body { flex: 1; overflow-y: auto; padding: 0 16px; }
.cmt-row { display: flex; gap: 10px; padding: 16px 0; border-bottom: 1px solid #f9f9f9; }
.cmt-pf { width: 32px; height: 32px; background: #ddd; border-radius: 50%; flex-shrink: 0; }
.cmt-data { flex: 1; }
.cmt-usr { font-size: 12px; font-weight: 700; color: #555; margin-bottom: 2px; }
.cmt-usr .time { font-weight: 400; color: #aaa; margin-left: 4px; font-size: 11px; }
.cmt-msg { font-size: 13px; color: #333; line-height: 1.3; }
.cmt-heart { color: #ccc; font-size: 14px; display: flex; flex-direction: column; align-items: center; cursor: pointer; }
.drawer-input { height: 70px; border-top: 1px solid #eee; display: flex; align-items: center; padding: 0 16px; gap: 10px; background: #fff; }
.inp { flex: 1; background: #F3F4F6; border: none; height: 40px; border-radius: 20px; padding: 0 16px; font-size: 14px; outline: none; }
.send { background: none; border: none; color: #FFD54F; font-weight: 700; font-size: 14px; cursor: pointer; }
</style>