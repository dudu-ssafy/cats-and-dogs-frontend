<template>
  <div class="home-container">
    <section class="hero-wrap">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1 class="main-copy">
          우리집 막내 건강,<br>
          이제 걱정 마세요!
        </h1>
        <p class="sub-copy">
          사진 한 장으로 시작하는 AI 주치의 프로젝트
        </p>
      </div>
      <div class="scroll-down">
        <div class="mouse-icon">
          <div class="mouse-wheel"></div>
        </div>
        <span>SCROLL</span>
      </div>
    </section>

    <div class="content-layer" ref="contentLayer">
      <div class="container">
        
        <section class="ai-section reveal">
          <div class="ai-text">
            <h2>어디가 아픈가요?</h2>
            <p>
              반려동물이 평소랑 다른 행동을 하나요?<br>
              궁금한 증상을 말해주시면 AI가 3초 만에 분석해드려요.<br>
              이제 병원 가기 전에 먼저 확인해보세요!
            </p>
            
            <div class="modern-search">
              <input 
                type="text" 
                placeholder="예: 강아지 눈꼽이 많이 껴요"
                v-model="searchQuery"
                @keyup.enter="goToAiDiagnosis"
              >
              <button class="search-icon-btn" @click="goToAiDiagnosis">
                <span class="material-icons-round">pets</span>
              </button>
            </div>

          </div>
          <div class="ai-visual">
            <div class="scan-effect"></div>
            <img src="@/assets/images/igmyeong-suuisa-cheongjingi-pekinijeu-gae-geomsa.jpg" class="ai-img" alt="AI 진단 강아지">
          </div>
        </section>

        <h2 class="section-title reveal">집사들의 와글와글 수다방</h2>
        <section class="board-grid reveal">
          
          <div class="board-box">
            <div class="board-header">
              <div class="c-header-group">
                <img src="@/assets/images/hot_icon.png" class="c-header-mini-icon" alt="hot">
                <h3>핫한 이야기</h3>
              </div>
              <span @click="goToCommunity('popular')">더보기 +</span>
            </div>
            <ul>
              <li 
                v-for="(post, index) in hotPosts" 
                :key="post.id" 
                class="post-item"
                @click="goToPostDetail(post.id)"
              >
                <span class="rank">{{ index + 1 }}</span>
                <span class="post-title">{{ post.title }}</span>
                <span class="post-meta">{{ post.likes }}</span>
              </li>
            </ul>
          </div>

          <div class="board-box">
            <div class="board-header">
              <div class="c-header-group">
                <img src="@/assets/images/new_icon.png" class="c-header-mini-icon" alt="new">
                <h3>실시간 질문</h3>
              </div>
              <span @click="goToCommunity('latest')">더보기 +</span>
            </div>
            <ul>
              <li 
                v-for="post in livePosts" 
                :key="post.id" 
                class="post-item"
                @click="goToPostDetail(post.id)"
              >
                <span class="post-title">{{ post.title }}</span>
                <span class="post-meta">{{ post.time }}</span>
              </li>
            </ul>
          </div>

        </section>


      </div> <!-- Close first container -->

      <!-- Sticky Scroll Section (Full Width) -->
      <section class="sticky-wrapper reveal">
        <!-- Left: Sticky Image (50%) -->
        <div class="sticky-left">
            <div class="sticky-visual">
              <img :src="stickyImg" alt="Party Cat" />
              <div class="sticky-msg">
                <h3>혹시 내 댕냥이도?<br>재미로 보는<br>멍냥이 팩트체크!</h3>
              </div>
            </div>
        </div>

        <!-- Right: Scroll Content (50%) -->
        <div class="scroll-right">
          
          <!-- Age Calculator -->
          <div class="age-calc-section">
            <div class="water-card age-card" style="margin:0; width:100%; max-width:100%;">
              <h2 class="section-title" style="margin-bottom:10px">🔢 멍냥이 나이 계산기</h2>
              <p class="section-desc u-text-center u-mb-40">우리 아이, 사람 나이로는 몇 살일까요?</p>

              <div class="calc-box">
                <div class="calc-inputs">
                  <div class="type-selector">
                    <button 
                      :class="{ active: petType === 'dog' }" 
                      @click="petType = 'dog'"
                    >🐶 강아지</button>
                    <button 
                      :class="{ active: petType === 'cat' }" 
                      @click="petType = 'cat'"
                    >🐱 고양이</button>
                  </div>
                  
                  <div class="input-row">
                    <label class="input-label">생일이 언제인가요?</label>
                    <input 
                      type="date" 
                      v-model="birthDate" 
                      class="date-input"
                    >
                  </div>
                </div>

                <div class="calc-result" v-if="humanAge">
                  <div class="result-circle age-circle">
                    <span class="age-emoji">🎂</span>
                    <span class="amount">{{ humanAge }}살</span>
                    <span class="cups">사람 나이 환산</span>
                  </div>
                  <p class="result-tip">
                    {{ petType === 'dog' ? '소형견 기준입니다. 대형견은 조금 더 높을 수 있어요!' : '고양이는 2살 이후로 노화가 천천히 진행돼요.' }}
                  </p>
                </div>
                <div class="calc-result" v-else>
                  <div class="result-circle age-placeholder">
                    <span class="age-emoji" style="opacity:0.5; filter:grayscale(1)">🎂</span>
                    <span class="cups">생일을 입력해주세요</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quiz -->
          <div class="quiz-wrapper">
              <h2 class="section-title" style="margin-bottom: 24px;">도전! 멍냥 OX 퀴즈</h2>
              <div class="quiz-container-single" style="gap:20px; margin-bottom:0;">
              <button class="nav-arrow prev" @click="changeQuiz(-1)">
                <span class="material-icons-round">chevron_left</span>
              </button>

              <div 
                class="quiz-card active" 
                :class="{ flipped: isFlipped }" 
                @click="flipCard"
                style="width:100%; height:450px;"
              >
                <div class="quiz-inner">
                  <div class="quiz-front">
                    <img :src="currentQuiz.img" class="q-img" :alt="currentQuiz.alt">
                    <div class="q-text-wrap">
                      <span class="q-badge">Q.0{{ currentQuizIdx + 1 }}</span>
                      <h3 class="q-question" v-html="currentQuiz.question"></h3>
                      <div class="q-options">
                        <div class="q-btn">O</div>
                        <div class="q-btn">X</div>
                      </div>
                    </div>
                  </div>
                  <div class="quiz-back">
                    <div class="a-result">{{ currentQuiz.answer }}</div>
                    <p class="a-desc" v-html="currentQuiz.desc"></p>
                    <span class="a-sub">(다시 터치하면 돌아가요)</span>
                  </div>
                </div>
              </div>

              <button class="nav-arrow next" @click="changeQuiz(1)">
                <span class="material-icons-round">chevron_right</span>
              </button>
            </div>
          </div>
          
        </div>
      </section>

      <div class="container"> <!-- Re-open second container -->

        <h2 class="section-title reveal">오늘의 꿀팁 매거진 📰</h2>
        <section class="featured-article reveal">
          <div class="f-card">
            <div class="f-img-box">
              <img :src="quizImg03" alt="산책하는 강아지">
            </div>
            <div class="f-content">
              <span class="f-tag">건강 관리</span>
              <h3 class="f-title">❄️ 추운 겨울,<br>우리 아이 산책 괜찮을까요?</h3>
              <p class="f-desc">
                날씨가 추워지면 산책을 나가도 될지 고민되시죠? 
                하지만 실내에만 있으면 스트레스가 쌓일 수 있어요. 
                겨울철 안전한 산책을 위한 3가지 수칙을 알려드립니다!
              </p>
              
              <ul class="f-tips-list">
                <li>
                  <strong>☀️ 가장 따뜻한 낮 시간에!</strong>
                  <span>체온 유지를 위해 햇빛이 있는 12~2시 사이를 추천해요.</span>
                </li>
                <li>
                  <strong>🧥 얇은 옷을 여러 겹!</strong>
                  <span>두꺼운 패딩 하나보다 얇은 옷을 레이어드하는 게 활동성에 좋아요.</span>
                </li>
                <li>
                  <strong>🐾 발바닥 보습 필수!</strong>
                  <span>차가운 땅과 염화칼슘으로부터 젤리를 보호하기 위해 산책 전후로 보습제를 발라주세요.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
    
    <!-- Footer Dummy -->
    <!-- Footer Dummy Removed -->

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; 
import api from '@/api';
import quizImg01 from '@/assets/images/joh-eun-sonyeon-chiwawa-gang-ajiui-chosanghwa.jpg';
import quizImg02 from '@/assets/images/nuwoseo-hapumhaneun-hoesaeg-julmunui-goyang-iui-selo-syas.jpg';
import quizImg03 from '@/assets/images/gwiyeoun-bodeo-kol-li-gang-ajiui-seutyudio-syas.jpg';
import stickyImg from '@/assets/images/dark_christmas_cat.png'; // New Dark Sticky Image
const router = useRouter();
const searchQuery = ref('');

// 0. AI 진단 이동
const goToAiDiagnosis = () => {
  if (!searchQuery.value.trim()) {
    alert('증상을 입력해주세요!'); 
    return;
  }
  router.push({ name: 'AiDiagnosis', query: { symptom: searchQuery.value } });
};

// 커뮤니티 메인으로 이동 (정렬 기준 전달)
const goToCommunity = (sortType) => {
  router.push({ 
    name: 'community',
    query: { sort: sortType } 
  });
};

// 게시글 상세 이동
const goToPostDetail = (id) => {
  router.push({ name: 'community-detail', params: { id: id } });
};

// 1. 게시판 데이터
const hotPosts = ref([]);
const livePosts = ref([]);

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000; // seconds

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
};

const fetchBoardData = async () => {
  try {
    // 인기글 가져오기
    const popularRes = await api.get('/boards/popular/');
    hotPosts.value = popularRes.data.slice(0, 3).map(post => ({
      id: post.id,
      title: post.title,
      likes: post.likes_count >= 1000 ? `${(post.likes_count/1000).toFixed(1)}k` : post.likes_count
    }));

    // 최신글 가져오기 (페이지네이션 적용된 결과에서 results 추출)
    const latestRes = await api.get('/boards/?page_size=3');
    livePosts.value = latestRes.data.results.map(post => ({
      id: post.id,
      title: post.title,
      time: formatTime(post.created_at)
    }));
  } catch (error) {
    console.error('Failed to fetch board data:', error);
  }
};

// 2-1. 나이 계산기
const petType = ref('dog');
const birthDate = ref('');

const humanAge = computed(() => {
  if (!birthDate.value) return null;
  
  const birth = new Date(birthDate.value);
  const now = new Date();
  let years = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    years--;
  }
  
  // 0살(1년 미만) 처리: 개월 수로 약식 계산 (단순화: 1개월 1살 등)
  // 여기서는 단순히 연도 기준 계산
  if (years < 0) return 0;

  // 공식 적용
  // 1년: 15살
  // 2년: 24살
  // 3년+: 24 + (년-2)*5 (강아지) / *4 (고양이)
  if (years === 0) return 1; // 1살 미만은 1살로 침 (파격적?) 아니면 개월수? 일단 1살로.
  
  if (years === 1) return 15;
  if (years === 2) return 24;
  
  if (petType.value === 'dog') {
    return 24 + (years - 2) * 5;
  } else {
    return 24 + (years - 2) * 4;
  }
});

// 2. 퀴즈 로직
const currentQuizIdx = ref(0);
const isFlipped = ref(false);

const quizData = [
  {
    img: quizImg01,
    alt: '강아지 눈',
    question: '강아지는 세상을<br>흑백으로만 본다?',
    answer: 'X',
    desc: '적록색맹과 비슷해요!<br>파란색과 노란색은 구분할 수 있어요.'
  },
  {
    img: quizImg02,
    alt: '우는 고양이',
    question: '다 큰 고양이는<br>사람에게만 "야옹" 한다?',
    answer: 'O',
    desc: '고양이끼리는 눈빛과 냄새로 대화해요.<br>집사에게만 목소리를 내는 거랍니다!'
  },
  {
    img: quizImg03,
    alt: '강아지 코',
    question: '강아지 코 지문으로<br>신원 확인이 가능하다?',
    answer: 'O',
    desc: '사람의 지문처럼 강아지 "비문"도<br>모두 달라서 등록이 가능해요!'
  }
];


// 3. Featured Article Data (No list needed anymore)
// const articles = [...]; // Removed
// const goToArticle = ... // Removed

const currentQuiz = computed(() => quizData[currentQuizIdx.value]);
const flipCard = () => { isFlipped.value = !isFlipped.value; };
const changeQuiz = (direction) => {
  isFlipped.value = false;
  let nextIdx = currentQuizIdx.value + direction;
  if (nextIdx >= quizData.length) nextIdx = 0;
  if (nextIdx < 0) nextIdx = quizData.length - 1;
  currentQuizIdx.value = nextIdx;
};

// 3. 스크롤 애니메이션 및 데이터 로드
onMounted(() => {
  fetchBoardData();
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('active');
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Jua&display=swap');
@import url('https://hangeul.pstatic.net/hangeul_static/css/nanum-square-round.css');
@import url('https://fonts.googleapis.com/icon?family=Material+Icons+Round');
</style>

<style scoped>
/* ========================================
    기존 스타일 100% 유지 + 추가 스타일
   ========================================
*/
.home-container {
    --font-title: 'Jua', cursive;
    --font-body: 'NanumSquareRound', sans-serif;
    --primary-honey: #FFB300; 
    --soft-butter: #FFF176; 
    --bg-cream: #FFFDE7; 
    --text-brown-dark: #4E342E; 
    --text-brown-light: #795548; 
    --shadow-soft: 0 12px 30px rgba(255, 179, 0, 0.25);
    
    font-family: var(--font-body);
    color: var(--text-brown-light);
    background-color: var(--bg-cream);
    /* overflow-x: hidden; REMOVED to enable sticky positioning */
}

h1, h2, h3, h4, .s-title, .tag-text, .badge { font-family: var(--font-title); }
a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; padding: 0; margin: 0; }
button { font-family: var(--font-body); border: none; cursor: pointer; }

/* ✅ 새로 추가된 미니 아이콘 스타일 (OOCSS) */
.c-header-group { display: flex; align-items: center; gap: 8px; }
.c-header-mini-icon { width: 30px; height: 26px; object-fit: contain; }

/* 1. Hero Section */
.hero-wrap {
    position: relative; width: 100%; height: 98vh; overflow: hidden;
    display: flex; align-items: center; justify-content: center;
    background-image: url('@/assets/images/puleun-jandieseo-jago-issneun-laebeulado-liteulibeo-gang-ajiui-geunjeob-chwal-yeong-syas.jpg');
    background-size: cover; background-position: center 30%; background-attachment: fixed;
}
.overlay { position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.5)); }
.hero-content {
    position: relative; z-index: 10; text-align: center; color: #fff;
    transform: translateY(20px); opacity: 0; animation: fadeUp 1s ease-out forwards; animation-delay: 0.5s;
    text-shadow: 0 2px 20px rgba(0,0,0,0.4); width: 90%;
}
@keyframes fadeUp { to { transform: translateY(0); opacity: 1; } }
.main-copy { font-size: 70px; line-height: 1.15; margin-bottom: 24px; }
.sub-copy { font-size: 22px; margin-bottom: 40px; font-family: var(--font-body); font-weight: 700;  }
.scroll-down {
    position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%);
    color: #fff; font-family: var(--font-title); font-size: 15px;
    animation: bounce 2s infinite; display: flex; flex-direction: column; align-items: center; gap: 8px;
    text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}
.mouse-icon { width: 28px; height: 44px; border: 2px solid #fff; border-radius: 50px; position: relative; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
.mouse-wheel { width: 4px; height: 6px; background: #fff; border-radius: 50%; position: absolute; top: 10px; left: 50%; transform: translateX(-50%); animation: wheel 2s infinite; }
@keyframes bounce { 0%, 20%, 50%, 80%, 100% {transform:translateX(-50%) translateY(0);} 40% {transform:translateX(-50%) translateY(-10px);} 60% {transform:translateX(-50%) translateY(-5px);} }
@keyframes wheel { 0% {top:10px; opacity:1;} 100% {top:24px; opacity:0;} }

/* 2. Content Layer */
.content-layer {
    position: relative; background: var(--bg-cream); z-index: 20;
    border-radius: 50px 50px 0 0; margin-top: -60px; padding-top: 100px; padding-bottom: 100px;
    box-shadow: 0 -20px 50px rgba(0,0,0,0.1);
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

/* AI Section */
.ai-section { display: flex; align-items: center; justify-content: space-between; gap: 60px; margin-bottom: 160px; }
.ai-text { flex: 1; }
.ai-text h2 { font-size: 52px; color: var(--text-brown-dark); margin-bottom: 20px; line-height: 1.25; }
.ai-text p { font-size: 19px; margin-bottom: 36px; line-height: 1.6; word-break: keep-all; }
.modern-search {
    display: flex; align-items: center; background: #fff; padding: 6px 6px 6px 24px;
    border-radius: 100px; width: 100%; max-width: 500px;
    transition: 0.3s; border: 4px solid var(--soft-butter); box-shadow: var(--shadow-soft);
}
.modern-search:focus-within { border-color: var(--primary-honey); transform: scale(1.02); }
.modern-search input { flex: 1; background: transparent; border: none; outline: none; font-size: 17px; font-family: var(--font-body); color: var(--text-brown-dark); height: 44px;}
.search-icon-btn {
    width: 50px; height: 50px; background: var(--primary-honey); color: #fff; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s;
    box-shadow: 0 4px 10px rgba(255, 179, 0, 0.4);
}
.search-icon-btn:hover { background: #FFCA28; transform: rotate(15deg); }
.ai-visual {
    flex-basis: 500px; min-width: 400px; height: 450px; 
    border-radius: 32px; overflow: hidden; position: relative;
    box-shadow: 0 20px 40px rgba(0,0,0,0.1); /* 더 부드럽고 넓은 그림자 */
    /* border 제거하여 모던하게 변경 */
}
.ai-img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.scan-effect {
    position: absolute; left:0; width:100%; height: 2px; /* 얇은 빛줄기 */
    background: #fff;
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8), 
                0 0 20px 4px rgba(255, 213, 79, 0.6); /* 빛 번짐 효과 (Glow) */
    top: 0;
    z-index: 5;
    animation: scanDown 8s infinite linear; /* 아주아주 천천히 정밀 스캔 */
}
@keyframes scanDown { 
    0% { top: -5%; opacity: 0; }
    5% { opacity: 1; }
    95% { opacity: 1; }
    100% { top: 105%; opacity: 0; } 
}

/* Boards Section */
/* Boards Section - Staggered Soft Layout */
.section-title { font-size: 36px; color: var(--text-brown-dark); margin-bottom: 50px; text-align: center; font-family: var(--font-title); }

.board-grid { 
    display: flex; flex-direction: column; gap: 60px; margin-bottom: 200px; 
    position: relative;
    max-width: 1000px; margin-left: auto; margin-right: auto;
}

.board-box { 
    background: #fff; border-radius: 32px; padding: 40px; 
    box-shadow: var(--shadow-soft); border: 2px solid #fff; 
    transition: 0.3s; width: 70%; 
    z-index: 10;
}
.board-box:hover { transform: translateY(-8px); border-color: var(--soft-butter); z-index: 20; }

/* Staggered Positioning */
.board-box:nth-child(1) {
    align-self: flex-start;
    margin-bottom: 0; /* No Overlap */
}
.board-box:nth-child(2) {
    align-self: flex-end;
    margin-top: 0;
}

.board-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 3px dashed #FFF176; padding-bottom: 16px; }
.board-header h3 { font-size: 24px; color: var(--text-brown-dark); }
.board-header span { font-size: 16px; color: var(--primary-honey); cursor: pointer; }
.post-item { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid #FFF3E0; cursor: pointer; transition: 0.2s; }
.post-item:hover { color: var(--text-brown-dark); padding-left: 8px; }
.post-title { font-size: 17px; font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 10px; }
.post-meta { font-size: 14px; color: #BCAAA4; white-space: nowrap; }
.rank { display: inline-block; width: 28px; height: 28px; background: var(--primary-honey); color: #fff; text-align: center; line-height: 28px; font-size: 15px; font-family: var(--font-title); border-radius: 50%; margin-right: 12px; }

/* Banner */
/* Age Calculator */
.age-calc-section { margin-bottom: 160px; display: flex; justify-content: center; }
.age-card { 
    background: #fff; width: 100%; max-width: 800px; padding: 50px; 
    border-radius: 40px; box-shadow: var(--shadow-soft); border: 2px solid #fff;
    text-align: center;
}
.age-card .section-desc { font-size: 18px; color: #8D6E63; margin-bottom: 40px; }
.calc-box { display: flex; gap: 40px; align-items: center; justify-content: center; }
.calc-inputs { flex: 1; display: flex; flex-direction: column; gap: 30px; }
.type-selector { display: flex; background: #FFF8E1; border-radius: 50px; padding: 5px; }
.type-selector button { 
    flex: 1; padding: 12px; border-radius: 40px; font-weight: 800; color: #A1887F; background: transparent; transition: 0.3s;
}
.type-selector button.active { background: #FFB300; color: #fff; box-shadow: 0 4px 10px rgba(255, 179, 0, 0.4); transform: scale(1.05); }

.input-row { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
.input-label { font-size: 16px; font-weight: 700; color: #795548; padding-left: 10px; }
.date-input { 
    width: 100%; padding: 15px 20px; font-size: 18px; border-radius: 20px; 
    border: 2px solid #EEE; outline: none; transition: 0.3s; font-family: var(--font-body); 
    color: #5D4037; text-align: center; cursor: pointer;
}
.date-input:focus { border-color: #FF7043; background: #FFF3E0; }

.calc-result { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; animation: fadeInResult 0.5s ease; }
@keyframes fadeInResult { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

.result-circle { 
    width: 200px; height: 200px; border-radius: 50%; color: #fff; 
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1); 
}
.age-circle {
    background: linear-gradient(135deg, #FF7043, #FF5722);
    box-shadow: 0 15px 40px rgba(255, 87, 34, 0.4);
    animation: pulseAge 3s infinite;
}
.age-placeholder {
    background: #EFEBE9; color: #BCAAA4; border: 4px dashed #D7CCC8; box-shadow: none;
}
.age-emoji { font-size: 50px; margin-bottom: 5px; line-height: 1; }
.amount { font-size: 48px; font-weight: 900; line-height: 1; font-family: var(--font-title); margin: 5px 0; }
.cups { font-size: 15px; opacity: 0.9; font-weight: 700; }
.result-tip { margin-top: 25px; font-size: 15px; color: #8D6E63; background: #FFF3E0; padding: 10px 20px; border-radius: 20px; line-height: 1.4; word-break: keep-all; }

@keyframes pulseAge {
    0% { transform: scale(1); box-shadow: 0 15px 40px rgba(255, 87, 34, 0.4); }
    50% { transform: scale(1.05); box-shadow: 0 20px 50px rgba(255, 87, 34, 0.6); }
    100% { transform: scale(1); box-shadow: 0 15px 40px rgba(255, 87, 34, 0.4); }
}

@media (max-width: 768px) {
  .calc-box { flex-direction: column; }
}

/* Quiz */
.quiz-container-single { display: flex; align-items: center; justify-content: center; gap: 40px; margin-bottom: 120px; }
.quiz-card { background-color: transparent; width: 700px; height: 400px; perspective: 1000px; cursor: pointer; display: block; }
.quiz-card.active { animation: fadeIn 0.5s ease; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.quiz-inner { position: relative; width: 100%; height: 100%; text-align: left; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); transform-style: preserve-3d; border-radius: 40px; box-shadow: var(--shadow-soft); }
.quiz-card.flipped .quiz-inner { transform: rotateY(180deg); }
.quiz-front { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 40px; display: flex; flex-direction: row; align-items: center; justify-content: space-between; padding: 30px; border: 4px solid #fff; background: #fff; color: var(--text-brown-dark); }
.quiz-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; border: 4px solid #fff; background: var(--primary-honey); color: #fff; transform: rotateY(180deg); text-align: center; }
.q-img { width: 45%; height: 100%; border-radius: 24px; object-fit: cover; margin-right: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.q-text-wrap { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.q-badge { background: var(--soft-butter); color: var(--text-brown-dark); padding: 8px 16px; border-radius: 20px; font-size: 16px; font-weight: 700; margin-bottom: 16px; display: inline-block; font-family: var(--font-title); }
.q-question { font-size: 26px; line-height: 1.35; word-break: keep-all; font-family: var(--font-title); margin-bottom: 24px; }
.q-options { display: flex; gap: 20px; }
.q-btn { width: 60px; height: 60px; border-radius: 50%; background: var(--bg-cream); border: 2px solid var(--primary-honey); color: var(--primary-honey); font-size: 28px; font-weight: 900; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
.q-btn:hover { transform: scale(1.1); background: var(--primary-honey); color: #fff; }
.a-result { font-size: 60px; font-weight: 900; margin-bottom: 16px; }
.a-desc { font-size: 20px; line-height: 1.6; word-break: keep-all; font-weight: 700; }
.a-sub { font-size: 14px; margin-top: 20px; opacity: 0.8; }
.nav-arrow { 
    width: 56px; height: 56px; 
    flex-shrink: 0; /* Fix: Prevent squashing */
    border-radius: 50%; 
    background: #2D2D2D; /* Premium Dark Charcoal */
    border: none;
    color: #fff; 
    font-size: 24px; 
    cursor: pointer; 
    box-shadow: 0 4px 12px rgba(0,0,0,0.15); 
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
    display: flex; align-items: center; justify-content: center; 
}
.nav-arrow:hover { 
    transform: scale(1.1); 
    background: #000;
    box-shadow: 0 8px 16px rgba(0,0,0,0.25); 
}
.reveal { opacity: 0; transform: translateY(60px); transition: 1s ease; }
.reveal.active { opacity: 1; transform: translateY(0); }

@media (max-width: 900px) {
    .main-copy { font-size: 48px; }
    .ai-section { flex-direction: column; text-align: center; }
    .ai-visual { width: 100%; min-width: auto; height: 350px; flex-basis: auto; }
    .modern-search { margin: 0 auto; }
    .board-grid { grid-template-columns: 1fr; }
    .quiz-container-single { gap: 10px; }
    .quiz-card { width: 320px; height: 500px; }
    .quiz-front { flex-direction: column; text-align: center; }
    .q-img { width: 100%; height: 200px; margin-right: 0; margin-bottom: 20px; }
    .q-text-wrap { align-items: center; }
    .q-question { font-size: 22px; margin-bottom: 24px; }
    .banner-title { font-size: 32px; }
    .adopt-banner-wrap { height: 400px; }
    
    .sticky-wrapper { flex-direction: column; }
    .sticky-left { width: 100%; position: relative; top: 0; margin-bottom: 40px; }
    .scroll-right { width: 100%; }
    .sticky-visual { height: 300px; }
    .sticky-msg h3 { font-size: 28px; }
}

/* Sticky Scroll Layout Full Width */
.sticky-wrapper {
  display: flex;
  align-items: stretch; /* Stretch to accommodate height */
  width: 100vw;
  margin-left: calc(50% - 50vw); /* Force full width within parent */
  position: relative;
  background: #FFFFFF; /* Pure White */
  margin-bottom: 200px;
}

.sticky-left {
  width: 40%; /* Reduced from 50% */
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 5;
}

.sticky-visual {
  width: 100%;
  height: 100%;
  position: relative;
}

.sticky-visual img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.sticky-msg {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%; /* Reduced height */
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%); /* Much lighter gradient */
  padding: 60px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: flex-start;
  text-align: left;
  transform: none;
  border: none;
  backdrop-filter: none;
  border-radius: 0;
  text-shadow: none; 
}

.sticky-msg h3 {
  font-family: 'NanumSquareRound', sans-serif; /* Back to clean round font */
  font-size: 40px; /* Reduced size */
  font-weight: 800;
  color: #fff;
  margin-bottom: 20px;
  line-height: 1.3;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.sticky-msg p {
  font-family: 'NanumSquareRound', sans-serif;
  font-size: 18px; /* Reduced size */
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 700;
  max-width: 500px;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.scroll-right {
  width: 60%; /* Increased from 50% */
  position: relative;
  background: #FFFFFF; /* Pure White */
  padding: 40px 60px 150px 60px; /* Reduced top padding from 150px to 40px */
  display: flex;
  flex-direction: column;
  gap: 120px; /* Reduced gap as requested */
  z-index: 6;
}

/* Ensure right content items are centered nicely */
.age-calc-section, .quiz-wrapper {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
}

@media (max-width: 900px) {
    .sticky-wrapper { flex-direction: column; }
    .sticky-left { width: 100%; height: 50vh; position: relative; }
    .scroll-right { width: 100%; padding: 60px 20px; }
}


/* Featured Article Section (Editorial Style) */
.featured-article {
  margin-bottom: 200px;
  display: flex;
  justify-content: center;
}

.f-card {
  display: flex;
  background: transparent;
  box-shadow: none;
  max-width: 850px; /* Reduced width */
  width: 100%;
  border: none;
  border-radius: 0;
  gap: 0; /* Remove gap to merge visuals */
  align-items: stretch; /* Stretch image to match text height */
}

.f-img-box {
  width: 280px; /* Reduced width */
  border-radius: 30px 0 0 30px;
  overflow: hidden;
  box-shadow: none;
  flex-shrink: 0;
  margin-top: 0;
}

.f-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.7s ease;
}

.f-card:hover .f-img-box img {
  transform: scale(1.05);
}

.f-content {
  flex: 1;
  background: #F7F7F5;
  padding: 40px; /* Reduced padding */
  border-radius: 0 30px 30px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.f-tag {
  display: inline-block;
  background: #FFF8E1; /* Soft cream */
  color: #FFB300;
  padding: 8px 16px;
  border-radius: 100px;
  font-weight: 800;
  font-size: 15px;
  margin-bottom: 24px;
  align-self: flex-start;
  font-family: var(--font-body);
}

.f-title {
  font-family: 'NanumSquareRound', sans-serif;
  font-size: 28px; /* Reduced font size */
  font-weight: 800;
  color: #333;
  margin-bottom: 16px;
  line-height: 1.3;
}

.f-desc {
  font-family: 'NanumSquareRound', sans-serif;
  font-size: 16px; /* Reduced font size */
  color: #555;
  line-height: 1.6;
  margin-bottom: 24px;
}

.f-tips-list {
  display: flex;
  flex-direction: column;
  gap: 12px; /* Tighter gap */
}

.f-tips-list li {
  background: transparent; /* No list background */
  padding: 0;
  border-radius: 0;
  border: none;
  font-family: 'NanumSquareRound', sans-serif;
  padding-left: 20px;
  border-left: 4px solid #FFB300; /* Minimal accent line */
}

.f-tips-list li strong {
  display: block;
  font-size: 16px;
  color: #333;
  margin-bottom: 4px;
  font-weight: 800;
}

.f-tips-list li span {
  font-size: 15px;
  color: #888;
}

@media (max-width: 768px) {
  .f-card { flex-direction: column; }
  .f-img-box { width: 100%; height: 250px; }
  .f-content { width: 100%; padding: 40px 30px; }
  .article-grid { grid-template-columns: 1fr; }
}

/* Global Body Overflow Fix (Optional, usually handled by reset) */
body { overflow-x: hidden; }

@media (max-width: 900px) {
    /* ... existing media query ... */
    .article-grid { grid-template-columns: 1fr; }
}
</style>