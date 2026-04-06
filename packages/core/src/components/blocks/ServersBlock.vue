<script setup lang="ts">
import { ref } from 'vue'
import type { Server } from '../../parser/types'

defineProps<{ servers: Server[] }>()

const activeIndex = ref(0)
</script>

<template>
  <div class="canvapi-servers">
    <div
      v-for="(server, i) in servers"
      :key="server.url"
      class="canvapi-servers__item"
      :class="{ 'canvapi-servers__item--active': i === activeIndex }"
      @click="activeIndex = i"
    >
      <span class="canvapi-servers__dot" :class="{ 'canvapi-servers__dot--active': i === activeIndex }">●</span>
      <span class="canvapi-servers__url">{{ server.url }}</span>
      <span v-if="server.description" class="canvapi-servers__desc">{{ server.description }}</span>
    </div>
  </div>
</template>
