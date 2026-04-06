<script setup lang="ts">
import type { Resource } from '../../parser/types'

defineProps<{ resources: Resource[] }>()

function getUniqueResponses(resources: Resource[]) {
  const responses = new Map<string, { statusCode: string; description: string; count: number }>()

  for (const resource of resources) {
    for (const endpoint of resource.endpoints) {
      for (const res of endpoint.responses) {
        if (responses.has(res.statusCode)) {
          responses.get(res.statusCode)!.count++
        } else {
          responses.set(res.statusCode, {
            statusCode: res.statusCode,
            description: res.description,
            count: 1,
          })
        }
      }
    }
  }

  return Array.from(responses.values()).sort((a, b) => a.statusCode.localeCompare(b.statusCode))
}

const statusIcon: Record<string, string> = {
  '2': '✅',
  '3': '↩',
  '4': '⚠️',
  '5': '❌',
}

function getIcon(code: string) {
  return statusIcon[code[0]] ?? '•'
}
</script>

<template>
  <div class="canvapi-responses-block">
    <div
      v-for="res in getUniqueResponses(resources)"
      :key="res.statusCode"
      class="canvapi-responses-block__item"
    >
      <span class="canvapi-responses-block__icon">{{ getIcon(res.statusCode) }}</span>
      <span class="canvapi-responses-block__code">{{ res.statusCode }}</span>
      <span class="canvapi-responses-block__desc">{{ res.description }}</span>
      <span class="canvapi-responses-block__count">×{{ res.count }}</span>
    </div>
  </div>
</template>
