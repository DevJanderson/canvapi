<script setup lang="ts">
import { ref, computed } from 'vue'
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

function selectEndpoint(ep: Endpoint) {
  selectedEndpoint.value = selectedEndpoint.value === ep ? null : ep
  emit('selectEndpoint', ep)
}

function onResourceClick(name: string) {
  toggleResource(name)
  emit('selectResource', name)
}

const methodColors: Record<string, string> = {
  get: 'bg-cv-get/15 text-cv-get',
  post: 'bg-cv-post/15 text-cv-post',
  put: 'bg-cv-put/15 text-cv-put',
  delete: 'bg-cv-delete/15 text-cv-delete',
  patch: 'bg-cv-patch/15 text-cv-patch',
}
</script>

<template>
  <aside class="canvapi-sidebar">
    <!-- Search -->
    <div class="canvapi-sidebar__search">
      <input
        v-model="search"
        type="text"
        placeholder="Search endpoints..."
        class="canvapi-sidebar__input"
      />
    </div>

    <!-- Endpoints list -->
    <nav class="canvapi-sidebar__nav">
      <div
        v-for="resource in filteredResources"
        :key="resource.name"
        class="canvapi-sidebar__group"
      >
        <button
          class="canvapi-sidebar__group-header"
          @click="onResourceClick(resource.name)"
        >
          <span class="canvapi-sidebar__arrow">
            {{ expandedResources.has(resource.name) ? '▾' : '▸' }}
          </span>
          <span class="canvapi-sidebar__group-name">{{ resource.name }}</span>
          <span class="canvapi-sidebar__group-count">{{ resource.endpoints.length }}</span>
        </button>

        <div v-if="expandedResources.has(resource.name)" class="canvapi-sidebar__endpoints">
          <button
            v-for="ep in resource.endpoints"
            :key="`${ep.method}-${ep.path}`"
            class="canvapi-sidebar__endpoint"
            :class="{ 'canvapi-sidebar__endpoint--active': selectedEndpoint === ep }"
            @click="selectEndpoint(ep)"
          >
            <span
              class="canvapi-sidebar__method"
              :class="methodColors[ep.method] ?? 'text-cv-text-muted'"
            >
              {{ ep.method.toUpperCase() }}
            </span>
            <span class="canvapi-sidebar__path">{{ ep.path }}</span>
          </button>
        </div>
      </div>
    </nav>

    <!-- Detail panel for selected endpoint -->
    <div v-if="selectedEndpoint" class="canvapi-sidebar__detail">
      <div class="canvapi-sidebar__detail-header">
        <span
          class="canvapi-sidebar__method"
          :class="methodColors[selectedEndpoint.method]"
        >
          {{ selectedEndpoint.method.toUpperCase() }}
        </span>
        <span class="canvapi-sidebar__detail-path">{{ selectedEndpoint.path }}</span>
      </div>

      <p v-if="selectedEndpoint.summary" class="canvapi-sidebar__detail-summary">
        {{ selectedEndpoint.summary }}
      </p>

      <!-- Parameters -->
      <div v-if="selectedEndpoint.parameters.length > 0" class="canvapi-sidebar__detail-section">
        <h4 class="canvapi-sidebar__detail-title">Parameters</h4>
        <div
          v-for="param in selectedEndpoint.parameters"
          :key="param.name"
          class="canvapi-sidebar__detail-param"
        >
          <span class="canvapi-sidebar__detail-param-name">
            {{ param.name }}
            <span v-if="param.required" class="canvapi-sidebar__detail-required">*</span>
          </span>
          <span class="canvapi-sidebar__detail-param-in">{{ param.in }}</span>
          <span class="canvapi-sidebar__detail-param-type">{{ param.schema.type ?? 'any' }}</span>
        </div>
      </div>

      <!-- Responses -->
      <div v-if="selectedEndpoint.responses.length > 0" class="canvapi-sidebar__detail-section">
        <h4 class="canvapi-sidebar__detail-title">Responses</h4>
        <div
          v-for="res in selectedEndpoint.responses"
          :key="res.statusCode"
          class="canvapi-sidebar__detail-response"
        >
          <span class="canvapi-sidebar__detail-status">{{ res.statusCode }}</span>
          <span class="canvapi-sidebar__detail-desc">{{ res.description }}</span>
        </div>
      </div>

      <!-- Security -->
      <div v-if="selectedEndpoint.security.length > 0" class="canvapi-sidebar__detail-section">
        <h4 class="canvapi-sidebar__detail-title">Auth</h4>
        <span class="canvapi-sidebar__detail-auth">🔒 {{ selectedEndpoint.security.join(', ') }}</span>
      </div>
    </div>
  </aside>
</template>
