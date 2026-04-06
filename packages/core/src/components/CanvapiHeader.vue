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

const methods: { label: string; value: HttpMethod | null }[] = [
  { label: 'ALL', value: null },
  { label: 'GET', value: 'get' },
  { label: 'POST', value: 'post' },
  { label: 'PUT', value: 'put' },
  { label: 'DEL', value: 'delete' },
  { label: 'PATCH', value: 'patch' },
]

function toggleFilter(method: HttpMethod | null) {
  emit('filter', props.activeFilter === method ? null : method)
}
</script>

<template>
  <header class="canvapi-header">
    <div class="canvapi-header__brand">canvapi</div>

    <div v-if="title" class="canvapi-header__api">
      <span class="canvapi-header__title">{{ title }}</span>
      <span v-if="version" class="canvapi-header__version">v{{ version }}</span>
    </div>

    <div class="canvapi-header__filters">
      <button
        v-for="m in methods"
        :key="m.label"
        class="canvapi-filter"
        :class="{
          'canvapi-filter--active': activeFilter === m.value,
          [`canvapi-filter--${m.value ?? 'all'}`]: activeFilter === m.value,
        }"
        @click="toggleFilter(m.value)"
      >
        {{ m.label }}
      </button>
    </div>

    <div class="canvapi-header__spacer" />

    <div class="canvapi-header__url">
      <span class="canvapi-header__url-text">{{ specUrl }}</span>
    </div>
  </header>
</template>
