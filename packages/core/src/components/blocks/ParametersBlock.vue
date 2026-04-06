<script setup lang="ts">
import type { Resource } from '../../parser/types'

defineProps<{ resources: Resource[] }>()

function getUniqueParams(resources: Resource[]) {
  const params = new Map<string, { name: string; in: string; type: string; required: boolean }>()

  for (const resource of resources) {
    for (const endpoint of resource.endpoints) {
      for (const param of endpoint.parameters) {
        const key = `${param.in}:${param.name}`
        if (!params.has(key)) {
          params.set(key, {
            name: param.name,
            in: param.in,
            type: param.schema.type ?? 'string',
            required: param.required,
          })
        }
      }
    }
  }

  return Array.from(params.values())
}
</script>

<template>
  <div class="canvapi-params-block">
    <div
      v-for="group in ['query', 'path', 'header']"
      :key="group"
      class="canvapi-params-block__group"
    >
      <div class="canvapi-params-block__group-title">{{ group }}</div>
      <div
        v-for="param in getUniqueParams(resources).filter(p => p.in === group)"
        :key="`${param.in}-${param.name}`"
        class="canvapi-params-block__item"
      >
        <span class="canvapi-params-block__name">{{ param.name }}</span>
        <span v-if="param.required" class="canvapi-params-block__required">req</span>
        <span class="canvapi-params-block__type">{{ param.type }}</span>
      </div>
    </div>
  </div>
</template>
