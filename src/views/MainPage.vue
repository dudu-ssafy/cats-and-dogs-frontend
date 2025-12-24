<template>
  <div class="home-container">
    <section class="hero-wrap">
      <div class="overlay"></div>
      <div class="hero-content">
        <h1 class="main-copy">
          우리집 막내 건강,<br/>
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
              반려동물이 평소랑 다른 행동을 하나요?<br/>
              궁금한 증상을 말해주시면 AI가 3초 만에 분석해드려요.<br/>
              이제 병원 가기 전에 먼저 확인해보세요!
            </p>
            
            <div class="modern-search">
              <input 
                type="text" 
                placeholder="예: 강아지 눈꼽이 많이 껴요"
                v-model="searchQuery"
                @keyup.enter="goToAiDiagnosis"
              />
              <button class="search-icon-btn" @click="goToAiDiagnosis">
                <span class="material-icons-round">pets</span>
              </button>
            </div>

          </div>
          <div class="ai-visual">
            <div class="scan-effect"></div>
            <img src="@/assets/images/igmyeong-suuisa-cheongjingi-pekinijeu-gae-geomsa.jpg" class="ai-img" alt="AI 진단 강아지"/>
          </div>
        </section>

        <h2 class="section-title reveal">집사들의 와글와글 수다방</h2>
        <section class="board-grid reveal">
          
          <div class="board-box">
            <div class="board-header">
              <div class="c-header-group">
                <img src="@/assets/images/hot_icon.png" class="c-header-mini-icon" alt="hot"/>
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
                <img src="@/assets/images/new_icon.png" class="c-header-mini-icon" alt="new"/>
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


      </div> 
      
      <section class="sticky-wrapper">
        <div class="sticky-left">
            <div class="sticky-visual">
              <img :src="stickyImg" alt="Party Cat" />
              <div class="sticky-msg">
                <h3>혹시 내 댕냥이도?<br/>재미로 보는<br/>멍냥이 팩트체크!</h3>
              </div>
            </div>
        </div>

        <div class="scroll-right">
          
          <div class="age-calc-section">
            <div class="age-wide-card">
              <div class="calc-left">
                <h3 class="calc-title">우리 아이<br/>나이 계산기</h3>
                <p class="calc-desc">생년월일 8자리를 입력해주세요!</p>
                
                <div class="wide-type-selector">
                   <button :class="{ active: petType === 'dog' }" @click="pressSelect('dog')">강아지</button>
                   <button :class="{ active: petType === 'cat' }" @click="pressSelect('cat')">고양이</button>
                </div>

                <div class="wide-input-group">
                   <div class="input-wrapper">
                       <input 
                          type="text" 
                          v-model="calcInput" 
                          placeholder="예: 20230101" 
                          maxlength="8"
                          @keyup.enter="calculateAge"
                       />
                       <span class="material-icons-round calendar-icon" @click="openDatePicker">calendar_month</span>
                   </div>

                   <input 
                      type="date" 
                      ref="datePicker"
                      @input="onDatePicked"
                      style="position:absolute; visibility:hidden; width:0; height:0;" 
                   />
                   
                   <button @click="calculateAge">확인</button>
                </div>
              </div>

              <div class="calc-right">
                 <div class="result-circle">
                    <div v-if="calculatedAge === null" class="default-view">
                       <img :src="currentPetImg" alt="Pet" class="circle-img"/>
                    </div>
                    
                    <div v-else class="result-view">
                       <div class="res-label">사람 나이로</div>
                       <div class="res-num">{{ calculatedAge }}세</div>
                       <button class="res-reset" @click="pressClear">다시하기</button>
                    </div>
                 </div>
              </div>
            </div>
          </div>

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
                style="height:450px;"
              >
                <div class="quiz-inner">
                  <div class="quiz-front">
                    <img :src="currentQuiz.img" class="q-img" :alt="currentQuiz.alt"/>
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

      <div class="container"> 

        <h2 class="section-title reveal">오늘의 꿀팁 매거진</h2>
        <section class="featured-article reveal">
          <div class="f-card">
            <div class="f-img-box">
              <img :src="winterWalkImg" alt="산책하는 강아지"/>
            </div>
            <div class="f-content">
              <span class="f-tag">건강 관리</span>
              <h3 class="f-title">❄️ 추운 겨울,<br/>우리 아이 산책 괜찮을까요?</h3>
              <p class="f-desc">
                날씨가 추워지면 산책을 나가도 될지 고민되시죠? 
                하지만 실내에만 있으면 스트레스가 쌓일 수 있어요. 
                겨울철 안전한 산책을 위한 3가지 수칙을 알려드립니다!
              </p>
              
              <ul class="f-tips-list">
                <li>
                  <strong> 가장 따뜻한 낮 시간에!</strong>
                  <span>체온 유지를 위해 햇빛이 있는 12~2시 사이를 추천해요.</span>
                </li>
                <li>
                  <strong> 얇은 옷을 여러 겹!</strong>
                  <span>두꺼운 패딩 하나보다 얇은 옷을 레이어드하는 게 활동성에 좋아요.</span>
                </li>
                <li>
                  <strong> 발바닥 보습 필수!</strong>
                  <span>차가운 땅과 염화칼슘으로부터 젤리를 보호하기 위해 산책 전후로 보습제를 발라주세요.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router'; 
import api from '@/api';
import quizImg01 from '@/assets/images/joh-eun-sonyeon-chiwawa-gang-ajiui-chosanghwa.jpg';
import quizImg02 from '@/assets/images/nuwoseo-hapumhaneun-hoesaeg-julmunui-goyang-iui-selo-syas.jpg';
import quizImg03 from '@/assets/images/gwiyeoun-bodeo-kol-li-gang-ajiui-seutyudio-syas.jpg';
import stickyImg from '@/assets/images/dark_christmas_cat.png'; 
import santaDogImg from '@/assets/images/santa_dog.png';
import santaCatImg from '@/assets/images/santa_cat.png';
import winterWalkImg from '@/assets/images/winter_walk_dog.png';

const router = useRouter();
const searchQuery = ref('');

const goToAiDiagnosis = () => {
  if (!searchQuery.value.trim()) {
    alert('증상을 입력해주세요!'); 
    return;
  }
  router.push({ name: 'AiDiagnosis', query: { symptom: searchQuery.value } });
};

const goToCommunity = (sortType) => {
  router.push({ 
    name: 'community',
    query: { sort: sortType } 
  });
};

const goToPostDetail = (id) => {
  router.push({ name: 'community-detail', params: { id: id } });
};

const hotPosts = ref([]);
const livePosts = ref([]);

const formatTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = (now - date) / 1000; 

  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
};

const fetchBoardData = async () => {
  try {
    const popularRes = await api.get('/boards/popular/');
    hotPosts.value = popularRes.data.slice(0, 3).map(post => ({
      id: post.id,
      title: post.title,
      likes: post.likes_count >= 1000 ? `${(post.likes_count/1000).toFixed(1)}k` : post.likes_count
    }));

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

const petType = ref('dog');
const calcInput = ref(''); 
const calculatedAge = ref(null); 
const datePicker = ref(null);

const currentPetImg = computed(() => {
    return petType.value === 'dog' ? santaDogImg : santaCatImg;
});

const pressClear = () => {
  calcInput.value = '';
  calculatedAge.value = null;
};

const pressSelect = (type) => {
    petType.value = type;
    if(calculatedAge.value !== null) calculateAge();
}

const openDatePicker = () => {
    if(datePicker.value) {
        if(datePicker.value.showPicker) {
            datePicker.value.showPicker();
        } else {
            datePicker.value.click(); 
        }
    }
};

const onDatePicked = (event) => {
    const val = event.target.value; 
    if(val) {
        calcInput.value = val.replace(/-/g, '');
    }
};

const calculateAge = () => {
  if (calcInput.value.length !== 8) return;

  const y = parseInt(calcInput.value.substring(0, 4));
  const m = parseInt(calcInput.value.substring(4, 6)) - 1; 
  const d = parseInt(calcInput.value.substring(6, 8));
  
  const birth = new Date(y, m, d);
  const now = new Date();
  
  if (isNaN(birth.getTime())) {
      calcInput.value = '';
      alert('올바른 날짜가 아닙니다.');
      return;
  }

  let years = now.getFullYear() - birth.getFullYear();
  const diffMonth = now.getMonth() - birth.getMonth();
  if (diffMonth < 0 || (diffMonth === 0 && now.getDate() < birth.getDate())) {
    years--;
  }

  if (years < 0) {
      calculatedAge.value = 0;
      return;
  }
  
  let result = 0;
  if (years === 0) result = 1; 
  else if (years === 1) result = 15;
  else if (years === 2) result = 24;
  else {
      if (petType.value === 'dog') result = 24 + (years - 2) * 5;
      else result = 24 + (years - 2) * 4;
  }
  calculatedAge.value = result;
};

const currentQuizIdx = ref(0);
const isFlipped = ref(false);

const quizData = [
  {
    img: quizImg03,
    alt: '강아지 코',
    question: '강아지 코 지문으로<br/>신원 확인이 가능하다?',
    answer: 'O',
    desc: '사람의 지문처럼 강아지 "비문"도<br/>모두 달라서 등록이 가능해요!'
  },
  {
    img: quizImg02,
    alt: '우는 고양이',
    question: '다 큰 고양이는<br/>사람에게만<br/>"야옹" 한다?',
    answer: 'O',
    desc: '고양이끼리는 눈빛과 냄새로 대화해요.<br/>집사에게만 목소리를 내는 거랍니다!'
  },
  {
    img: quizImg01,
    alt: '강아지 눈',
    question: '강아지는 세상을<br/>흑백으로만 본다?',
    answer: 'X',
    desc: '적록색맹과 비슷해요!<br/>파란색과 노란색은 구분할 수 있어요.'
  }
];

const currentQuiz = computed(() => quizData[currentQuizIdx.value]);
const flipCard = () => { isFlipped.value = !isFlipped.value; };
const changeQuiz = (direction) => {
  isFlipped.value = false;
  let nextIdx = currentQuizIdx.value + direction;
  if (nextIdx >= quizData.length) nextIdx = 0;
  if (nextIdx < 0) nextIdx = quizData.length - 1;
  currentQuizIdx.value = nextIdx;
};

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
}

h1, h2, h3, h4, .s-title, .tag-text, .badge { font-family: var(--font-title); }
a { text-decoration: none; color: inherit; transition: 0.3s; }
ul { list-style: none; padding: 0; margin: 0; }
button { font-family: var(--font-body); border: none; cursor: pointer; }

.c-header-group { display: flex; align-items: center; gap: 8px; }
.c-header-mini-icon { width: 30px; height: 26px; object-fit: contain; }

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

.content-layer {
    position: relative; background: var(--bg-cream); z-index: 20;
    border-radius: 50px 50px 0 0; margin-top: -60px; padding-top: 100px; padding-bottom: 100px;
    box-shadow: 0 -20px 50px rgba(0,0,0,0.1);
}
.container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }

.ai-section { display: flex; align-items: center; justify-content: space-between; gap: 60px; margin-bottom: 160px; }
.ai-text { flex: 1; }
.ai-text h2 { font-size: 52px; color: var(--text-brown-dark); margin-bottom: 20px; line-height: 1.25; font-family: 'OneMobilePop', cursive; font-weight: normal; }
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
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
}
.ai-img { width: 100%; height: 100%; object-fit: cover; object-position: center; }
.scan-effect {
    position: absolute; left:0; width:100%; height: 2px;
    background: #fff;
    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 4px rgba(255, 213, 79, 0.6);
    top: 0; z-index: 5;
    animation: scanDown 8s infinite linear;
}
@keyframes scanDown { 
    0% { top: -5%; opacity: 0; }
    5% { opacity: 1; }
    95% { opacity: 1; }
    100% { top: 105%; opacity: 0; } 
}

.section-title { font-size: 36px; color: var(--text-brown-dark); margin-bottom: 50px; text-align: center; font-family: 'OneMobilePop', cursive; font-weight: normal; }
.board-grid { 
    display: flex; flex-direction: column; gap: 60px; margin-bottom: 200px; 
    position: relative; max-width: 1000px; margin-left: auto; margin-right: auto;
}
.board-box { 
    background: #fff; border-radius: 32px; padding: 40px; 
    box-shadow: var(--shadow-soft); border: 2px solid #fff; 
    transition: 0.3s; width: 70%; z-index: 10;
}
.board-box:hover { transform: translateY(-8px); border-color: var(--soft-butter); z-index: 20; }
.board-box:nth-child(1) { align-self: flex-start; margin-bottom: 0; }
.board-box:nth-child(2) { align-self: flex-end; margin-top: 0; }

.board-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 3px dashed #FFF176; padding-bottom: 16px; }
.board-header h3 { font-size: 24px; color: var(--text-brown-dark); font-family: 'OneMobilePop', cursive; font-weight: normal; }
.board-header span { font-size: 16px; color: var(--primary-honey); cursor: pointer; }
.post-item { display: flex; align-items: center; padding: 14px 0; border-bottom: 1px solid #FFF3E0; cursor: pointer; transition: 0.2s; }
.post-item:hover { color: var(--text-brown-dark); padding-left: 8px; }
.post-title { font-size: 17px; font-weight: 700; flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-right: 10px; }
.post-meta { font-size: 14px; color: #BCAAA4; white-space: nowrap; }
.rank { display: inline-block; width: 28px; height: 28px; background: var(--primary-honey); color: #fff; text-align: center; line-height: 28px; font-size: 15px; font-family: var(--font-title); border-radius: 50%; margin-right: 12px; }

/* Layout Objects: Cards with fixed width for consistency */
.age-calc-section, .quiz-wrapper { width: 100%; max-width: 750px; margin: 0 auto; }

.age-calc-section { display: flex; justify-content: center; }
.age-wide-card {
    width: 750px; height: 380px; background: #FFF; border-radius: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: space-between;
    padding: 0 60px; border: 4px solid #FFF;
}
.calc-left { display: flex; flex-direction: column; align-items: flex-start; flex: 1; padding-right: 40px; }
.calc-title { font-size: 32px; font-weight: normal; color: #333; line-height: 1.3; margin-bottom: 12px; font-family: 'OneMobilePop', cursive; }
.calc-desc { font-size: 16px; color: #999; margin-bottom: 30px; font-weight: 700; }
.wide-type-selector { display: flex; gap: 10px; margin-bottom: 24px; width: 100%; }
.wide-type-selector button {
    flex: 1; padding: 12px; border-radius: 12px; border: 2px solid #F0F0F0; background: #FAFAFA;
    font-weight: 700; font-size: 16px; color: #BBB; transition: 0.2s; cursor: pointer;
}
.wide-type-selector button.active { border-color: #FFB300; background: #FFF8E1; color: #FF6F00; }
.wide-input-group { display: flex; gap: 10px; width: 100%; align-items: center; }
.input-wrapper { position: relative; flex: 1; display: flex; align-items: center; }
.wide-input-group input {
    width: 100%; height: 52px; border: 2px solid #EEE; border-radius: 12px; padding: 0 16px; padding-right: 48px;
    font-size: 18px; font-weight: 700; color: #333; outline: none; background: #FAFAFA; font-family: 'OneMobilePop', cursive;
}
.wide-input-group input:focus { border-color: #FFB300; background: #FFF; }
.calendar-icon { position: absolute; right: 16px; color: #333; font-size: 24px; cursor: pointer; transition: 0.2s; }
.wide-input-group button {
    width: 80px; height: 52px; background: #333; color: #FFF; border-radius: 12px; font-weight: 800; font-size: 16px; transition: 0.2s; border: none; cursor: pointer; font-family: 'OneMobilePop', cursive;
}
.calc-right { flex-shrink: 0; }
.result-circle {
    width: 260px; height: 260px; border-radius: 50%; background: #FFF3E0; border: 3px solid #4E342E;
    box-shadow: 0 10px 30px rgba(0,0,0,0.1); position: relative; overflow: hidden; display: flex; align-items: center; justify-content: center;
}
.circle-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
.result-view { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 100%; height: 100%; animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.res-label { font-size: 16px; color: #8D6E63; font-weight: 700; font-family: 'OneMobilePop', cursive; }
.res-num { font-size: 70px; font-weight: 900; font-family: 'OneMobilePop', cursive; color: #FF6F00; line-height: 1.1; margin: 4px 0 16px 0; }
.res-reset { padding: 8px 16px; background: #8D6E63; color: #FFF; border-radius: 20px; font-size: 14px; font-weight: 700; cursor: pointer; }
@keyframes popIn { 0% { transform: scale(0.5); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }

.quiz-container-single { display: flex; align-items: center; justify-content: center; gap: 40px; margin-bottom: 0; }
.quiz-card { background-color: transparent; width: 750px; height: 400px; perspective: 1000px; cursor: pointer; }
.quiz-inner { position: relative; width: 100%; height: 100%; transition: transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1); transform-style: preserve-3d; border-radius: 40px; box-shadow: var(--shadow-soft); }
.quiz-card.flipped .quiz-inner { transform: rotateY(180deg); }
.quiz-front, .quiz-back { position: absolute; width: 100%; height: 100%; -webkit-backface-visibility: hidden; backface-visibility: hidden; border-radius: 40px; border: 4px solid #fff; }
.quiz-front { display: flex; align-items: center; justify-content: space-between; padding: 30px; background: #fff; color: var(--text-brown-dark); }
.quiz-back { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; background: var(--primary-honey); color: #fff; transform: rotateY(180deg); text-align: center; }
.q-img { width: 45%; height: 100%; border-radius: 24px; object-fit: cover; margin-right: 30px; }
.q-text-wrap { flex: 1; display: flex; flex-direction: column; align-items: flex-start; }
.q-badge { background: #4E342E; color: #fff; padding: 8px 16px; border-radius: 20px; font-family: 'OneMobilePop', cursive; margin-bottom: 16px; }
.q-question { font-size: 26px; line-height: 1.35; font-family: 'OneMobilePop', cursive; margin-bottom: 24px; font-weight: 100; }
.q-options { display: flex; gap: 20px; }
.q-btn { width: 60px; height: 60px; border-radius: 50%; background: var(--bg-cream); border: 2px solid var(--primary-honey); color: var(--primary-honey); font-size: 28px; display: flex; align-items: center; justify-content: center; font-family: 'OneMobilePop', cursive; }
.a-result { font-size: 60px; font-family: 'OneMobilePop', cursive; margin-bottom: 16px; }
.a-desc { font-size: 20px; line-height: 1.6; font-family: 'OneMobilePop', cursive; }
.nav-arrow { width: 56px; height: 56px; flex-shrink: 0; border-radius: 50%; background: #fff; color: var(--primary-honey); cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; }
.reveal { opacity: 0; transform: translateY(60px); transition: 1s ease; }
.reveal.active { opacity: 1; transform: translateY(0); }

/* ========================================
   [Layout Structure] Sticky Section Update
   ========================================
*/
.sticky-wrapper {
  display: flex;
  align-items: flex-start; 
  width: 100vw;
  margin-left: calc(50% - 50vw);
  position: relative;
  background: #F7F7F5;
  margin-bottom: 200px;
}

.sticky-left {
  width: 40%;
  position: sticky; 
  top: 0;           
  height: 100vh;    
  overflow: hidden;
  z-index: 5;
}

/* Fix: Increased padding and gap to 600px to prolong the sticky duration.
  This forces the user to scroll through more content (empty space) while the left image remains fixed.
  All spacings (top, gap, bottom) are set identical for visual rhythm.
*/
.scroll-right {
  width: 60%;
  position: relative;
  background: #F7F7F5;
  padding: 600px 60px; /* Top/Bottom padding: 600px, Left/Right: 60px */
  display: flex;
  flex-direction: column;
  gap: 600px; /* Spacing between cards: 600px */
  z-index: 6;
}

.sticky-visual { width: 100%; height: 100%; position: relative; }
.sticky-visual img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sticky-msg {
  position: absolute; bottom: 0; left: 0; width: 100%; height: 50%;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 100%);
  padding: 60px; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start;
}
.sticky-msg h3 {
  font-family: 'NanumSquareRound', sans-serif; font-size: 40px; font-weight: 800;
  color: #fff; line-height: 1.3; text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
}

.featured-article { margin-bottom: 200px; display: flex; justify-content: center; }
.f-card { display: flex; max-width: 1000px; width: 100%; align-items: stretch; }
.f-img-box { width: 280px; border-radius: 30px 0 0 30px; overflow: hidden; flex-shrink: 0; }
.f-img-box img { width: 100%; height: 100%; object-fit: cover; transition: 0.7s; }
.f-content { flex: 1; background: #F7F7F5; padding: 40px; border-radius: 0 30px 30px 0; display: flex; flex-direction: column; justify-content: center; }
.f-tag { display: inline-block; background: #FFF8E1; color: #FFB300; padding: 8px 16px; border-radius: 100px; font-weight: 800; font-size: 15px; margin-bottom: 24px; align-self: flex-start; }
.f-title { font-family: 'OneMobilePop', cursive; font-size: 28px; color: #333; margin-bottom: 16px; line-height: 1.3; }
.f-desc { font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 24px; }
.f-tips-list { display: flex; flex-direction: column; gap: 12px; }
.f-tips-list li { padding-left: 20px; border-left: 4px solid #FFB300; }
.f-tips-list li strong { display: block; font-size: 16px; color: #333; margin-bottom: 4px; font-weight: 800; }
.f-tips-list li span { font-size: 15px; color: #888; }

body { overflow-x: hidden; }

@media (max-width: 900px) {
    .sticky-wrapper { flex-direction: column; }
    .sticky-left { width: 100%; height: 50vh; position: relative; }
    .scroll-right { width: 100%; padding: 60px 20px; }
}
</style>