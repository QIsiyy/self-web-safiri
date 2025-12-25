<template>
  <div id="app" class="app-container">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

onMounted(async () => {
  const version = await window.electronAPI.app.getVersion()
  console.log('App version:', version)
})
</script>

<style scoped>
.app-container {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
