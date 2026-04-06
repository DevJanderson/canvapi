<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  title: string
  icon?: string
  blockId: string
}>()

const emit = defineEmits<{
  hide: [blockId: string]
}>()

const minimized = ref(false)
const expanded = ref(false)

function toggleMinimize() {
  minimized.value = !minimized.value
  if (minimized.value) expanded.value = false
}

function toggleExpand() {
  expanded.value = !expanded.value
  if (expanded.value) minimized.value = false
}

function hide() {
  emit('hide', props.blockId)
}
</script>

<template>
  <div
    class="canvapi-block"
    :class="{
      'canvapi-block--minimized': minimized,
      'canvapi-block--expanded': expanded,
    }"
  >
    <div class="canvapi-block__header" @click="toggleMinimize">
      <span v-if="icon" class="canvapi-block__icon">{{ icon }}</span>
      <span class="canvapi-block__title">{{ title }}</span>
      <div class="canvapi-block__controls" @click.stop>
        <button class="canvapi-block__btn" :title="minimized ? 'Expand' : 'Minimize'" @click="toggleMinimize">
          {{ minimized ? '+' : '−' }}
        </button>
        <button class="canvapi-block__btn" title="Fullscreen" @click="toggleExpand">
          {{ expanded ? '↙' : '□' }}
        </button>
        <button class="canvapi-block__btn" title="Hide" @click="hide">
          ×
        </button>
      </div>
    </div>
    <div v-show="!minimized" class="canvapi-block__body">
      <slot />
    </div>
  </div>
</template>
