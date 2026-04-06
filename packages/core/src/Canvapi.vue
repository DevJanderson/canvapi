<script setup lang="ts">
import type { CanvapiProps } from './types'

withDefaults(defineProps<CanvapiProps>(), {
  theme: 'dark',
  layout: 'overview',
})
</script>

<template>
  <div class="canvapi" :data-theme="theme">
    <p>Canvapi — em construção</p>
  </div>
</template>

<style scoped>
.canvapi {
  font-family: system-ui, -apple-system, sans-serif;
}
</style>
