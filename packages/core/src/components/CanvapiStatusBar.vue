<script setup lang="ts">
import { Lock } from 'lucide-vue-next'
import { Separator } from '@/components/ui/separator'
import type { ParsedAPI } from '../parser/types'

defineProps<{ api: ParsedAPI }>()

function totalEndpoints(api: ParsedAPI): number {
  return api.resources.reduce((sum, r) => sum + r.endpoints.length, 0)
}
</script>

<template>
  <footer class="flex items-center gap-2 px-4 h-7 border-t bg-card shrink-0 font-mono text-[10px] text-muted-foreground">
    <span>REST</span>
    <Separator orientation="vertical" class="h-3" />
    <span>OpenAPI {{ api.info.openapiVersion }}</span>
    <Separator orientation="vertical" class="h-3" />
    <span>{{ totalEndpoints(api) }} endpoints</span>
    <Separator orientation="vertical" class="h-3" />
    <span>{{ api.schemas.length }} schemas</span>
    <Separator orientation="vertical" class="h-3" />
    <span>{{ api.resources.length }} resources</span>

    <template v-if="api.auth.length > 0">
      <Separator orientation="vertical" class="h-3" />
      <span class="flex items-center gap-1 text-indigo-400">
        <Lock class="size-2.5" />
        {{ api.auth.map(a => a.name).join(', ') }}
      </span>
    </template>

    <span class="ml-auto truncate max-w-[240px]">{{ api.servers[0]?.url ?? '/' }}</span>
  </footer>
</template>
