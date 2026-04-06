<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import { Braces } from 'lucide-vue-next'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import type { SchemaNodeData } from '../../canvas/types'

defineProps<{ data: SchemaNodeData }>()
</script>

<template>
  <Card class="min-w-[200px] max-w-[280px] shadow-lg">
    <CardHeader class="p-3 pb-2">
      <CardTitle class="flex items-center gap-2 text-sm">
        <Braces class="size-3.5 text-muted-foreground" />
        {{ data.name }}
      </CardTitle>
    </CardHeader>
    <CardContent class="p-0">
      <div v-for="prop in data.properties" :key="prop.name" class="flex items-center gap-2 px-3 py-0.5">
        <span class="font-mono text-[11px]">
          {{ prop.name }}
          <span v-if="prop.required" class="text-red-500 font-bold">*</span>
        </span>
        <span class="font-mono text-[10px] text-muted-foreground ml-auto">{{ prop.type }}</span>
      </div>
      <div v-if="data.properties.length === 0" class="px-3 py-2 text-[11px] text-muted-foreground">
        No properties
      </div>
    </CardContent>
    <Handle type="target" :position="Position.Left" class="!size-1.5 !bg-muted-foreground !border-none" />
    <Handle type="source" :position="Position.Right" class="!size-1.5 !bg-muted-foreground !border-none" />
  </Card>
</template>
