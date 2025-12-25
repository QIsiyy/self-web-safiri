<template>
  <div class="home-view">
    <div class="welcome-container">
      <h1 class="title">Self Web Safiri</h1>
      <p class="subtitle">个性化浏览器</p>
      <el-button type="primary" size="large" @click="goToBrowser">开始浏览</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goToBrowser() {
  router.push('/browser')
}
</script>

<style scoped lang="scss">
.home-view {
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.welcome-container {
  text-align: center;
  color: white;

  .title {
    font-size: 48px;
    font-weight: bold;
    margin-bottom: 16px;
  }

  .subtitle {
    font-size: 24px;
    margin-bottom: 32px;
    opacity: 0.9;
  }
}
</style>
