<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { AuthNodeData } from '../../canvas/types'

defineProps<{ data: AuthNodeData }>()

const schemeLabel: Record<string, string> = {
  http: 'HTTP',
  apiKey: 'API Key',
  oauth2: 'OAuth 2.0',
  openIdConnect: 'OpenID Connect',
}
</script>

<template>
  <div class="canvapi-node canvapi-node--auth">
    <div class="canvapi-node__header">
      <span class="canvapi-node__icon">🔒</span>
      <span class="canvapi-node__title">Auth</span>
    </div>
    <div class="canvapi-node__body">
      <div
        v-for="scheme in data.schemes"
        :key="scheme.name"
        class="canvapi-auth__scheme"
      >
        <span class="canvapi-auth__type">{{ schemeLabel[scheme.type] ?? scheme.type }}</span>
        <span class="canvapi-auth__name">{{ scheme.name }}</span>
        <span v-if="scheme.scheme" class="canvapi-auth__detail">{{ scheme.scheme }}</span>
        <span v-if="scheme.bearerFormat" class="canvapi-auth__detail">{{ scheme.bearerFormat }}</span>
      </div>
    </div>
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
