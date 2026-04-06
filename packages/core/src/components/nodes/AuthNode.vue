<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Lock } from 'lucide-vue-next'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { AuthNodeData } from '../../canvas/types'

defineProps<{ data: AuthNodeData }>()
</script>

<template>
  <Card class="min-w-[200px] max-w-[260px] border-indigo-500/50 shadow-lg shadow-indigo-500/5">
    <CardHeader class="p-3 pb-2">
      <CardTitle class="flex items-center gap-2 text-sm">
        <Lock class="size-3.5 text-indigo-400" />
        Auth
      </CardTitle>
    </CardHeader>
    <CardContent class="p-3 pt-0 space-y-1">
      <div v-for="scheme in data.schemes" :key="scheme.name" class="flex items-center gap-2">
        <Badge variant="secondary" class="font-mono text-[10px] px-1.5 py-0 text-indigo-400 bg-indigo-500/10">
          {{ scheme.type === 'http' ? 'HTTP' : scheme.type }}
        </Badge>
        <span class="text-[11px] text-muted-foreground">{{ scheme.name }}</span>
        <span v-if="scheme.scheme" class="font-mono text-[10px] text-muted-foreground">{{ scheme.scheme }}</span>
      </div>
    </CardContent>
    <Handle type="source" :position="Position.Right" class="!size-1.5 !bg-indigo-400 !border-none" />
  </Card>
</template>
