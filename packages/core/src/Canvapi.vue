<script setup lang="ts">
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

const { api, filteredGraph, loading, error, methodFilter } = useCanvapi({
  specUrl: props.specUrl,
})

function onFilter(method: typeof methodFilter.value) {
  methodFilter.value = method
}
</script>

<template>
  <div class="canvapi" :data-theme="theme">
    <CanvapiHeader
      :spec-url="specUrl"
      :title="api?.info.title"
      :version="api?.info.version"
      :active-filter="methodFilter"
      @filter="onFilter"
    />

    <div v-if="loading" class="canvapi-loading">
      Loading spec...
    </div>

    <div v-else-if="error" class="canvapi-error">
      {{ error }}
    </div>

    <div v-else-if="api && filteredGraph" class="canvapi-main">
      <CanvapiSidebar :api="api" />
      <div class="canvapi-main__canvas">
        <CanvapiCanvas :graph="filteredGraph" />
      </div>
    </div>

    <CanvapiStatusBar v-if="api" :api="api" />
  </div>
</template>
