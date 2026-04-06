<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ResourceNodeData } from '../../canvas/types'

defineProps<{ data: ResourceNodeData }>()

const methodColor: Record<string, string> = {
  get: 'text-green-500',
  post: 'text-blue-500',
  put: 'text-amber-500',
  delete: 'text-red-500',
  patch: 'text-purple-500',
  options: 'text-muted-foreground',
  head: 'text-muted-foreground',
}
</script>

<template>
  <Card class="min-w-[220px] max-w-[300px] shadow-lg">
    <CardHeader class="p-3 pb-2">
      <CardTitle class="flex items-center gap-2 text-sm">
        {{ data.name }}
        <Badge variant="secondary" class="font-mono text-[10px] px-1.5 py-0 ml-auto">
          {{ data.endpoints.length }}
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div
        v-for="ep in data.endpoints"
        :key="`${ep.method}-${ep.path}`"
        class="flex items-center gap-2 px-3 py-1 hover:bg-accent transition-colors"
        :class="{ 'opacity-40 line-through': ep.deprecated }"
      >
        <span class="font-mono text-[10px] font-bold min-w-[44px] tracking-wide" :class="methodColor[ep.method]">
          {{ ep.method.toUpperCase() }}
        </span>
        <span class="font-mono text-[11px] text-muted-foreground truncate">{{ ep.path }}</span>
      </div>
    </CardContent>
    <Handle type="target" :position="Position.Left" class="!size-1.5 !bg-muted-foreground !border-none" />
    <Handle type="source" :position="Position.Right" class="!size-1.5 !bg-muted-foreground !border-none" />
  </Card>
</template>
