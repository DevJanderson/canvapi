<script setup lang="ts">
import { ref } from 'vue'
import type { CanvapiProps } from './types'
import { useCanvapi } from './composables/useCanvapi'
import CanvapiHeader from './components/CanvapiHeader.vue'
import CanvapiSidebar from './components/CanvapiSidebar.vue'
import CanvapiCanvas from './components/CanvapiCanvas.vue'
import CanvapiStatusBar from './components/CanvapiStatusBar.vue'
import './style.css'

const props = withDefaults(defineProps<CanvapiProps>(), {
  theme: 'dark',
  layout: 'overview',
})

const currentTheme = ref<'dark' | 'light'>(props.theme)

const { api, filteredGraph, loading, error, methodFilter } = useCanvapi({
  specUrl: props.specUrl,
})

function onFilter(method: typeof methodFilter.value) {
  methodFilter.value = method
}

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="h-screen w-full flex flex-col overflow-hidden" :class="currentTheme === 'dark' ? 'dark' : ''">
    <div class="flex flex-col flex-1 overflow-hidden bg-background text-foreground">
      <CanvapiHeader
        :spec-url="specUrl"
        :title="api?.info.title"
        :version="api?.info.version"
        :active-filter="methodFilter"
        :theme="currentTheme"
        @filter="onFilter"
        @toggle-theme="toggleTheme"
      />

      <div v-if="loading" class="flex items-center justify-center flex-1 text-sm text-muted-foreground">
        Loading spec...
      </div>

      <div v-else-if="error" class="flex items-center justify-center flex-1 text-sm text-destructive">
        {{ error }}
      </div>

      <div v-else-if="api && filteredGraph" class="flex flex-1 overflow-hidden">
        <CanvapiSidebar :api="api" />
        <div class="flex-1 relative overflow-hidden">
          <CanvapiCanvas :graph="filteredGraph" />
        </div>
      </div>

      <CanvapiStatusBar v-if="api" :api="api" />
    </div>
  </div>
</template>
