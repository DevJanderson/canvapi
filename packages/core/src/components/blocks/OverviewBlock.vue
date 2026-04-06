<script setup lang="ts">
import type { APIInfo } from '../../parser/types'

defineProps<{ info: APIInfo }>()
</script>

<template>
  <div class="canvapi-overview">
    <div class="canvapi-overview__row">
      <span class="canvapi-overview__label">{{ info.title }}</span>
      <span class="canvapi-overview__badge">v{{ info.version }}</span>
      <span class="canvapi-overview__badge">{{ info.openapiVersion }}</span>
    </div>
    <p v-if="info.description" class="canvapi-overview__desc">{{ info.description }}</p>
    <div v-if="info.contact" class="canvapi-overview__meta">
      <span v-if="info.contact.name">{{ info.contact.name }}</span>
      <span v-if="info.contact.email" class="canvapi-overview__email">{{ info.contact.email }}</span>
    </div>
    <div v-if="info.license" class="canvapi-overview__meta">
      <span class="canvapi-overview__badge">{{ info.license.name }}</span>
    </div>
  </div>
</template>
