<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import type { HttpMethod } from '../types'

const props = defineProps<{
  specUrl: string
  title?: string
  version?: string
  activeFilter: HttpMethod | null
  theme: 'dark' | 'light'
}>()

const emit = defineEmits<{
  filter: [method: HttpMethod | null]
  toggleTheme: []
}>()

const methods: { label: string; value: HttpMethod | null; color: string }[] = [
  { label: 'ALL', value: null, color: '' },
  { label: 'GET', value: 'get', color: 'text-green-500' },
  { label: 'POST', value: 'post', color: 'text-blue-500' },
  { label: 'PUT', value: 'put', color: 'text-amber-500' },
  { label: 'DEL', value: 'delete', color: 'text-red-500' },
  { label: 'PATCH', value: 'patch', color: 'text-purple-500' },
]

function toggleFilter(method: HttpMethod | null) {
  emit('filter', props.activeFilter === method ? null : method)
}
</script>

<template>
  <header class="flex items-center gap-3 px-4 h-11 border-b bg-card shrink-0">
    <span class="text-sm font-bold tracking-tight">canvapi</span>

    <Separator orientation="vertical" class="h-4" />

    <div v-if="title" class="flex items-center gap-2">
      <span class="text-sm font-medium text-muted-foreground">{{ title }}</span>
      <Badge v-if="version" variant="secondary" class="text-[10px] px-1.5 py-0 font-mono">
        v{{ version }}
      </Badge>
    </div>

    <Separator orientation="vertical" class="h-4" />

    <div class="flex gap-0.5">
      <Button
        v-for="m in methods"
        :key="m.label"
        variant="ghost"
        size="sm"
        class="h-6 px-2 text-[10px] font-mono font-bold"
        :class="[
          activeFilter === m.value ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
          activeFilter === m.value && m.color,
        ]"
        @click="toggleFilter(m.value)"
      >
        {{ m.label }}
      </Button>
    </div>

    <div class="flex-1" />

    <span class="font-mono text-[11px] text-muted-foreground truncate max-w-[280px]">
      {{ specUrl }}
    </span>

    <Button variant="ghost" size="icon" class="size-7 shrink-0" @click="emit('toggleTheme')">
      <Sun v-if="theme === 'dark'" class="size-3.5" />
      <Moon v-else class="size-3.5" />
    </Button>
  </header>
</template>
