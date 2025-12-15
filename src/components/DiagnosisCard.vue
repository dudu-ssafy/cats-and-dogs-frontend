<script setup>
defineProps({
  data: Object 
});
</script>

<template>
  <div class="diagnosis-card">
    <div class="card-header">
        <div>
            <div class="disease-title">{{ data.title }}</div>
            <span class="disease-eng">{{ data.engTitle }}</span>
        </div>
        <span class="badge warning">주의 단계</span>
    </div>

    <div class="card-body">
        <div class="accuracy-wrap">
            <div class="accuracy-label">
                <span>AI 분석 일치도</span>
                <span style="font-weight:700; color:#FFC107">{{ data.accuracy }}%</span>
            </div>
            <div class="progress-track">
                <div class="progress-fill" :style="{ width: data.accuracy + '%' }"></div>
            </div>
        </div>

        <p class="diagnosis-text" v-html="data.description"></p>

        <div class="solution-box">
            <div class="solution-title">💡 AI 닥터의 권장 행동</div>
            <ul class="solution-list">
                <li v-for="(sol, idx) in data.solutions" :key="idx">{{ sol }}</li>
            </ul>
        </div>

        <div class="notice-box">
            <span class="material-icons-round notice-icon">verified_user</span>
            <div class="notice-text">
                <strong>잠깐! AI 진단은 참고용이에요.</strong><br>
                정확한 상태 확인을 위해 <strong>수의사 선생님과 꼭 상의</strong>해주세요.
            </div>
        </div>
    </div>

    <div class="card-footer">
        <button class="btn-action primary">
            <span class="material-icons-round" style="font-size:18px">local_hospital</span>
            가까운 병원 찾기
        </button>
        <button class="btn-action secondary">
            <span class="material-icons-round" style="font-size:18px">badge</span>
            동물등록증 확인
        </button>
    </div>
  </div>
</template>

<style scoped>
.diagnosis-card { display: flex; flex-direction: column; background: #fff; border: 1px solid #E5E7EB; border-radius: 16px; overflow: hidden; width: 100%; max-width: 500px; margin-top: 10px; }

.card-header { padding: 20px; background: #FFFDE7; border-bottom: 1px solid #F0F0F0; display: flex; justify-content: space-between; align-items: flex-start; }
.disease-title { font-size: 18px; font-weight: 800; color: #111827; margin-bottom: 4px; }
.disease-eng { font-size: 13px; color: #6B7280; display: block; }
.badge { padding: 4px 10px; border-radius: 100px; font-size: 12px; font-weight: 700; }
.badge.warning { background: #FFFBEB; color: #D97706; border: 1px solid #FCD34D; }

.card-body { padding: 20px; text-align: left; }

.accuracy-wrap { margin-bottom: 20px; }
.accuracy-label { display: flex; justify-content: space-between; font-size: 13px; color: #6B7280; margin-bottom: 6px; }
.progress-track { width: 100%; height: 8px; background: #F3F4F6; border-radius: 4px; overflow: hidden; }
.progress-fill { height: 100%; background: #FFC107; border-radius: 4px; width: 0; transition: width 1s ease-out; }

.diagnosis-text { font-size: 15px; color: #374151; margin-bottom: 16px; line-height: 1.6; }

.solution-box { background: #F9FAFB; padding: 16px; border-radius: 12px; margin-bottom: 16px; }
.solution-title { font-size: 13px; font-weight: 700; margin-bottom: 8px; color: #6B7280; }
.solution-list { list-style: none; padding-left: 0; margin: 0; }
.solution-list li { position: relative; padding-left: 20px; font-size: 14px; margin-bottom: 6px; text-align: left;}
.solution-list li::before { content: '•'; position: absolute; left: 4px; color: #FFC107; font-weight: bold; }

.notice-box { padding: 14px; background-color: #F0F9FF; border: 1px solid #BAE6FD; border-radius: 12px; display: flex; align-items: flex-start; gap: 10px; }
.notice-icon { color: #0EA5E9; font-size: 20px; margin-top: 2px; }
.notice-text { font-size: 13px; color: #4B5563; line-height: 1.5; word-break: keep-all; text-align: left; }

.card-footer { padding: 16px 20px; border-top: 1px solid #E5E7EB; display: flex; gap: 10px; background: #fff; }
.btn-action { flex: 1; padding: 12px; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: 0.2s; border: none; display: flex; justify-content: center; align-items: center; gap: 6px; }
.btn-action.primary { background: #111827; color: white; }
.btn-action.secondary { background: white; border: 1px solid #E5E7EB; color: #111827; }
</style>