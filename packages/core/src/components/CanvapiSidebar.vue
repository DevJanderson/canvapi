<script setup lang="ts">
import { ref, computed } from 'vue'
import { ChevronRight, Lock, Search } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import type { ParsedAPI, Endpoint } from '../parser/types'

const props = defineProps<{
  api: ParsedAPI
}>()

const emit = defineEmits<{
  selectEndpoint: [endpoint: Endpoint]
  selectResource: [resourceName: string]
}>()

const search = ref('')
const expandedResources = ref<Set<string>>(new Set(props.api.resources.map((r) => r.name)))
const selectedEndpoint = ref<Endpoint | null>(null)

const filteredResources = computed(() => {
  if (!search.value) return props.api.resources
  const q = search.value.toLowerCase()
  return props.api.resources
    .map((r) => ({
      ...r,
      endpoints: r.endpoints.filter(
        (ep) =>
          ep.path.toLowerCase().includes(q) ||
          ep.summary?.toLowerCase().includes(q) ||
          ep.method.includes(q),
      ),
    }))
    .filter((r) => r.endpoints.length > 0)
})

function toggleResource(name: string) {
  if (expandedResources.value.has(name)) {
    expandedResources.value.delete(name)
  } else {
    expandedResources.value.add(name)
  }
}

function onSelectEndpoint(ep: Endpoint) {
  selectedEndpoint.value = selectedEndpoint.value === ep ? null : ep
  emit('selectEndpoint', ep)
}

const methodVariant: Record<string, string> = {
  get: 'bg-green-500/15 text-green-500',
  post: 'bg-blue-500/15 text-blue-500',
  put: 'bg-amber-500/15 text-amber-500',
  delete: 'bg-red-500/15 text-red-500',
  patch: 'bg-purple-500/15 text-purple-500',
  options: 'bg-muted text-muted-foreground',
  head: 'bg-muted text-muted-foreground',
}
</script>

<template>
  <aside class="w-64 border-r bg-card flex flex-col shrink-0 overflow-hidden">
    <!-- Search -->
    <div class="p-3">
      <div class="relative">
        <Search class="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground" />
        <Input
          v-model="search"
          placeholder="Search endpoints..."
          class="pl-8 h-8 text-xs"
        />
      </div>
    </div>

    <Separator />

    <!-- Endpoints list -->
    <ScrollArea class="flex-1">
      <nav class="py-1">
        <Collapsible
          v-for="resource in filteredResources"
          :key="resource.name"
          :default-open="expandedResources.has(resource.name)"
          @update:open="toggleResource(resource.name)"
        >
          <CollapsibleTrigger
            class="flex items-center gap-1.5 w-full px-3 py-1.5 text-left hover:bg-accent transition-colors"
            @click="emit('selectResource', resource.name)"
          >
            <ChevronRight class="size-3 text-muted-foreground transition-transform duration-200 [[data-state=open]>&]:rotate-90" />
            <span class="text-xs font-semibold tracking-tight flex-1">{{ resource.name }}</span>
            <span class="font-mono text-[10px] text-muted-foreground">{{ resource.endpoints.length }}</span>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <button
              v-for="ep in resource.endpoints"
              :key="`${ep.method}-${ep.path}`"
              class="flex items-center gap-2 w-full px-3 py-1 pl-7 text-left hover:bg-accent transition-colors"
              :class="{ 'bg-accent': selectedEndpoint === ep }"
              @click="onSelectEndpoint(ep)"
            >
              <span
                class="font-mono text-[9px] font-bold px-1.5 py-px rounded shrink-0"
                :class="methodVariant[ep.method] ?? 'bg-muted text-muted-foreground'"
              >
                {{ ep.method.toUpperCase() }}
              </span>
              <span class="font-mono text-[11px] text-muted-foreground truncate">{{ ep.path }}</span>
            </button>
          </CollapsibleContent>
        </Collapsible>
      </nav>
    </ScrollArea>

    <!-- Detail panel -->
    <template v-if="selectedEndpoint">
      <Separator />
      <ScrollArea class="max-h-[40%] shrink-0">
        <div class="p-3 space-y-3">
          <div class="flex items-center gap-2">
            <span
              class="font-mono text-[9px] font-bold px-1.5 py-px rounded"
              :class="methodVariant[selectedEndpoint.method]"
            >
              {{ selectedEndpoint.method.toUpperCase() }}
            </span>
            <span class="font-mono text-xs font-semibold truncate">{{ selectedEndpoint.path }}</span>
          </div>

          <p v-if="selectedEndpoint.summary" class="text-[11px] text-muted-foreground leading-relaxed">
            {{ selectedEndpoint.summary }}
          </p>

          <!-- Parameters -->
          <div v-if="selectedEndpoint.parameters.length > 0">
            <h4 class="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Parameters</h4>
            <div
              v-for="param in selectedEndpoint.parameters"
              :key="param.name"
              class="flex items-center gap-1.5 py-0.5"
            >
              <span class="font-mono text-[11px]">
                {{ param.name }}
                <span v-if="param.required" class="text-red-500 font-bold">*</span>
              </span>
              <Badge variant="outline" class="text-[8px] px-1 py-0 h-3.5 font-mono">{{ param.in }}</Badge>
              <span class="font-mono text-[10px] text-muted-foreground ml-auto">{{ param.schema.type ?? 'any' }}</span>
            </div>
          </div>

          <!-- Responses -->
          <div v-if="selectedEndpoint.responses.length > 0">
            <h4 class="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-1">Responses</h4>
            <div
              v-for="res in selectedEndpoint.responses"
              :key="res.statusCode"
              class="flex items-center gap-2 py-0.5"
            >
              <span class="font-mono text-[11px] font-semibold min-w-[28px]">{{ res.statusCode }}</span>
              <span class="text-[11px] text-muted-foreground">{{ res.description }}</span>
            </div>
          </div>

          <!-- Security -->
          <div v-if="selectedEndpoint.security.length > 0" class="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Lock class="size-3" />
            <span>{{ selectedEndpoint.security.join(', ') }}</span>
          </div>
        </div>
      </ScrollArea>
    </template>
  </aside>
</template>
