<script setup lang="ts">
import { VueFlow, useVueFlow } from '@vue-flow/core'
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

const { fitView } = useVueFlow()

function onNodesInitialized() {
  // eslint-disable-next-line no-undef
  globalThis.setTimeout(() => {
    fitView({ padding: 0.15, duration: 300 })
  }, 100)
}
</script>

<template>
  <div class="absolute inset-0 overflow-hidden">
    <VueFlow
      :nodes="graph.nodes"
      :edges="graph.edges"
      :node-types="nodeTypes"
      :min-zoom="0.15"
      :max-zoom="2.5"
      :snap-to-grid="true"
      :snap-grid="[20, 20]"
      class="!bg-background [background-image:radial-gradient(circle,oklch(0.5_0_0/0.15)_1px,transparent_1px)] [background-size:24px_24px]"
      @nodes-initialized="onNodesInitialized"
    />
  </div>
</template>
