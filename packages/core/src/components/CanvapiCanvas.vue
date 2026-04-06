<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import { markRaw } from 'vue'
import type { CanvasGraph } from '../canvas/types'
import AuthNode from './nodes/AuthNode.vue'
import ResourceNode from './nodes/ResourceNode.vue'
import SchemaNode from './nodes/SchemaNode.vue'

defineProps<{
  graph: CanvasGraph
}>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const nodeTypes: Record<string, any> = {
  auth: markRaw(AuthNode),
  resource: markRaw(ResourceNode),
  schema: markRaw(SchemaNode),
}
</script>

<template>
  <div class="canvapi-canvas">
    <VueFlow
      :nodes="graph.nodes"
      :edges="graph.edges"
      :node-types="nodeTypes"
      :default-viewport="{ zoom: 0.85, x: 50, y: 50 }"
      :min-zoom="0.2"
      :max-zoom="2"
      fit-view-on-init
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      class="canvapi-flow"
    />
  </div>
</template>
