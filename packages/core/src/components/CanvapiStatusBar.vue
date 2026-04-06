<script setup lang="ts">
import type { ParsedAPI } from '../parser/types'

defineProps<{ api: ParsedAPI }>()

function totalEndpoints(api: ParsedAPI): number {
  return api.resources.reduce((sum, r) => sum + r.endpoints.length, 0)
}
</script>

<template>
  <footer class="canvapi-statusbar">
    <span class="canvapi-statusbar__item">
      REST · OpenAPI {{ api.info.openapiVersion }}
    </span>
    <span class="canvapi-statusbar__sep">·</span>
    <span class="canvapi-statusbar__item">
      {{ totalEndpoints(api) }} endpoints
    </span>
    <span class="canvapi-statusbar__sep">·</span>
    <span class="canvapi-statusbar__item">
      {{ api.schemas.length }} schemas
    </span>
    <span class="canvapi-statusbar__sep">·</span>
    <span class="canvapi-statusbar__item">
      {{ api.resources.length }} resources
    </span>
    <span v-if="api.auth.length > 0" class="canvapi-statusbar__auth">
      🔒 {{ api.auth.map(a => `${a.name} (${a.scheme ?? a.type})`).join(', ') }}
    </span>
    <span class="canvapi-statusbar__server">
      {{ api.servers[0]?.url ?? '/' }}
    </span>
  </footer>
</template>
