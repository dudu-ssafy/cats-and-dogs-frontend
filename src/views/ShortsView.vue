<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';
import ShortsItem from '@/components/ShortsItem.vue';

const videos = ref([]);

const showCommentDrawer = ref(false);

onMounted(() => {
    fetchShorts();
});

const fetchShorts = async () => {
    try {
        const response = await api.get('/shorts/');
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
            isFollowed: false // TODO: 팔로우 상태 연동 시 업데이트
        }));
    } catch (error) {
        console.error('Failed to fetch shorts:', error);
    }
};

const toggleComments = () => {
    showCommentDrawer.value = !showCommentDrawer.value;
};

const toggleLike = (video) => {
    api.post(`/shorts/${video.id}/like/`)
    .then(response => {
        video.isLiked = response.data.is_liked;
        video.likes = response.data.likes;
    })
    .catch(error => {
        console.error('Failed to toggle like:', error);
    });
};

// 🔥 팔로우 토글 함수
const toggleFollow = (video) => {
    video.isFollowed = !video.isFollowed;
};
</script>

<template>
  <div class="shorts-bg-layer">
    <div class="center-wrapper">
        <div class="mobile-frame">
            <div class="video-scroll-container">
                <ShortsItem 
                    v-for="video in videos" 
                    :key="video.id" 
                    :video="video"
                    class="video-item"
                    :is-comment-open="showCommentDrawer"
                    @toggle-like="toggleLike"
                    @toggle-follow="toggleFollow"
                    @toggle-comments="toggleComments"
                />
            </div>
        </div>

        <div class="side-drawer" :class="{ open: showCommentDrawer }">
            <div class="drawer-inner">
                <div class="drawer-head">
                    <span>댓글 248</span>
                    <span class="material-icons-round close-btn" @click="toggleComments">close</span>
                </div>
                
                <div class="drawer-body">
                    <div class="cmt-row" v-for="i in 12" :key="i">
                        <div class="cmt-pf"></div>
                        <div class="cmt-data">
                            <div class="cmt-usr">유저{{i}} <span class="time">1분전</span></div>
                            <div class="cmt-msg">완전 힐링되네요! 😍 영상 더 올려주세요.</div>
                        </div>
                        <div class="cmt-heart">
                            <span class="material-icons-round">favorite_border</span>
                            <span style="font-size:10px">2</span>
                        </div>
                    </div>
                </div>

                <div class="drawer-input">
                    <input type="text" placeholder="댓글 입력..." class="inp">
                    <button class="send">게시</button>
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
