<script setup lang="ts">
import type { AuthScheme } from '../../parser/types'

defineProps<{ schemes: AuthScheme[] }>()

const typeLabel: Record<string, string> = {
  http: 'HTTP',
  apiKey: 'API Key',
  oauth2: 'OAuth 2.0',
  openIdConnect: 'OpenID',
}
</script>

<template>
  <div class="canvapi-auth-block">
    <div v-for="scheme in schemes" :key="scheme.name" class="canvapi-auth-block__item">
      <span class="canvapi-auth-block__type">{{ typeLabel[scheme.type] ?? scheme.type }}</span>
      <span class="canvapi-auth-block__name">{{ scheme.name }}</span>
      <span v-if="scheme.scheme" class="canvapi-auth-block__detail">{{ scheme.scheme }}</span>
      <span v-if="scheme.bearerFormat" class="canvapi-auth-block__detail">{{ scheme.bearerFormat }}</span>
    </div>
    <div v-if="schemes.length === 0" class="canvapi-auth-block__empty">No auth required</div>
  </div>
</template>
