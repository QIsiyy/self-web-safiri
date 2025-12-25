import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const version = ref<string>('')
  const isLoading = ref<boolean>(false)

  async function loadVersion() {
    version.value = await window.electronAPI.app.getVersion()
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  return {
    version,
    isLoading,
    loadVersion,
    setLoading
  }
})
