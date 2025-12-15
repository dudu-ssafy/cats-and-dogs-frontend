<script setup>
import { ref } from 'vue';

const videos = ref([
    {
        id: 1,
        username: '멍멍이맘',
        userImg: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        videoUrl: 'https://cdn.pixabay.com/video/2021/04/14/71089-537131758_tiny.mp4', 
        desc: '산책 나갈 생각에 벌써 신난 댕댕이 ㅋㅋ 🐶<br>꼬리 흔드는 것 좀 보세요! #귀여움 #힐링',
        music: 'Happy Dog Song - Original Sound',
        likes: 1200,
        comments: 248,
        isLiked: false,
        isFollowed: false // 🔥 팔로우 상태 추가
    },
    {
        id: 2,
        username: '냥냥펀치',
        userImg: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        videoUrl: 'https://cdn.pixabay.com/video/2020/06/23/42828-433066916_tiny.mp4',
        desc: '박스만 보면 들어가는 고양이...📦<br>왜 저러는지 아시는 분? #고양이 #박스냥',
        music: 'Funny Cat - Meow Mix',
        likes: 560,
        comments: 42,
        isLiked: false,
        isFollowed: false
    },
    {
        id: 3,
        username: '자연인',
        userImg: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',
        videoUrl: 'https://cdn.pixabay.com/video/2019/06/07/24252-341364503_tiny.mp4',
        desc: '힐링되는 숲속 풍경 🌿<br>주말엔 다들 뭐하시나요?',
        music: 'Nature Sounds - Relaxing',
        likes: 890,
        comments: 15,
        isLiked: false,
        isFollowed: true // 이미 팔로우한 상태 예시
    }
]);

const showCommentDrawer = ref(false);

const toggleComments = () => {
    showCommentDrawer.value = !showCommentDrawer.value;
};

const toggleLike = (video) => {
    video.isLiked = !video.isLiked;
    video.likes += video.isLiked ? 1 : -1;
};

// 🔥 팔로우 토글 함수
const toggleFollow = (video) => {
    video.isFollowed = !video.isFollowed;
};

const togglePlay = (event) => {
    const videoEl = event.target;
    if (videoEl.paused) {
        videoEl.play();
    } else {
        videoEl.pause();
    }
};
</script>

<template>
  <div class="shorts-bg-layer">
    
    <div class="center-wrapper">
        
        <div class="mobile-frame">
            <div class="video-scroll-container">
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
                            
                            <button 
                                class="btn-follow" 
                                :class="{ 'following': video.isFollowed }"
                                @click.stop="toggleFollow(video)"
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
                        <button class="act-btn" :class="{ active: video.isLiked }" @click="toggleLike(video)">
                            <span class="material-icons-round icon">favorite</span>
                            <span class="cnt">{{ video.likes }}</span>
                        </button>
                        
                        <button class="act-btn" @click="toggleComments" :class="{ active: showCommentDrawer }">
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
.full-video { width: 100%; height: 100%; object-fit: cover; display: block; }
.video-overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 40%; background: linear-gradient(to top, rgba(0,0,0,0.8), transparent); pointer-events: none; }

/* 정보 영역 */
.info-area { position: absolute; bottom: 20px; left: 16px; width: 75%; color: white; z-index: 10; text-shadow: 0 1px 2px rgba(0,0,0,0.5); }
.profile-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.thumb { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #fff; }
.name { font-weight: 700; font-size: 15px; }

/* 🔥 [핵심] 팔로우 버튼 스타일 */
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
/* 팔로잉 상태일 때 스타일 (채워진 배경) */
.btn-follow.following {
    background: rgba(255, 255, 255, 0.2); /* 반투명 흰색 */
    border-color: transparent;
    color: #FFD54F; /* 노란색 텍스트 */
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