<script setup lang="ts">
import type { HttpMethod } from '../types'

const props = defineProps<{
  specUrl: string
  title?: string
  version?: string
  activeFilter: HttpMethod | null
}>()

const emit = defineEmits<{
  filter: [method: HttpMethod | null]
}>()

const methods: { label: string; value: HttpMethod | null; color: string }[] = [
  { label: 'All', value: null, color: '#a1a1aa' },
  { label: 'GET', value: 'get', color: '#22c55e' },
  { label: 'POST', value: 'post', color: '#3b82f6' },
  { label: 'PUT', value: 'put', color: '#f59e0b' },
  { label: 'DELETE', value: 'delete', color: '#ef4444' },
  { label: 'PATCH', value: 'patch', color: '#a855f7' },
]

function toggleFilter(method: HttpMethod | null) {
  emit('filter', props.activeFilter === method ? null : method)
}
</script>

<template>
  <div class="canvapi-header">
    <div class="canvapi-header__top">
      <div class="canvapi-header__brand">canvapi</div>
      <div class="canvapi-header__url">
        <span class="canvapi-header__url-text">{{ specUrl }}</span>
      </div>
      <div v-if="title" class="canvapi-header__info">
        <span class="canvapi-header__title">{{ title }}</span>
        <span v-if="version" class="canvapi-header__version">v{{ version }}</span>
      </div>
    </div>
    <div class="canvapi-header__filters">
      <button
        v-for="m in methods"
        :key="m.label"
        class="canvapi-filter"
        :class="{ 'canvapi-filter--active': activeFilter === m.value }"
        :style="activeFilter === m.value ? { borderColor: m.color, color: m.color } : {}"
        @click="toggleFilter(m.value)"
      >
        {{ m.label }}
      </button>
    </div>
  </div>
</template>
