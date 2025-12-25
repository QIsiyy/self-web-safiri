<template>
  <div class="browser-view">
    <div class="browser-container">
      <div class="browser-header">
        <div class="browser-toolbar">
          <el-button-group>
            <el-button :icon="ArrowLeft" @click="goBack" :disabled="!canGoBack" />
            <el-button :icon="ArrowRight" @click="goForward" :disabled="!canGoForward" />
            <el-button :icon="RefreshRight" @click="refresh" />
          </el-button-group>
          <el-input
            v-model="url"
            placeholder="输入网址或搜索内容"
            class="url-input"
            @keyup.enter="navigate"
          >
            <template #append>
              <el-button :icon="Search" @click="navigate" />
            </template>
          </el-input>
        </div>
      </div>
      <div class="browser-content">
        <div class="content-placeholder">
          <el-empty description="浏览器内容区域" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ArrowLeft, ArrowRight, RefreshRight, Search } from '@element-plus/icons-vue'

const url = ref('')
const canGoBack = ref(false)
const canGoForward = ref(false)

function goBack() {
  console.log('Go back')
}

function goForward() {
  console.log('Go forward')
}

function refresh() {
  console.log('Refresh')
}

function navigate() {
  console.log('Navigate to:', url.value)
}
</script>

<style scoped lang="scss">
.browser-view {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.browser-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.browser-header {
  border-bottom: 1px solid var(--el-border-color);
  padding: 8px 16px;
  background: var(--el-bg-color);
}

.browser-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
}

.url-input {
  flex: 1;
}

.browser-content {
  flex: 1;
  overflow: auto;
}

.content-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
</style>
