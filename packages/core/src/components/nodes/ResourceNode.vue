<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { ResourceNodeData } from '../../canvas/types'

defineProps<{ data: ResourceNodeData }>()

const methodColors: Record<string, string> = {
  get: '#22c55e',
  post: '#3b82f6',
  put: '#f59e0b',
  delete: '#ef4444',
  patch: '#a855f7',
  options: '#6b7280',
  head: '#6b7280',
}
</script>

<template>
  <div class="canvapi-node canvapi-node--resource">
    <div class="canvapi-node__header">
      <span class="canvapi-node__title">{{ data.name }}</span>
      <span class="canvapi-node__badge">{{ data.endpoints.length }}</span>
    </div>
    <div class="canvapi-node__body">
      <div
        v-for="ep in data.endpoints"
        :key="`${ep.method}-${ep.path}`"
        class="canvapi-endpoint"
        :class="{ 'canvapi-endpoint--deprecated': ep.deprecated }"
      >
        <span
          class="canvapi-endpoint__method"
          :style="{ color: methodColors[ep.method] }"
        >
          {{ ep.method.toUpperCase() }}
        </span>
        <span class="canvapi-endpoint__path">{{ ep.path }}</span>
      </div>
    </div>
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
