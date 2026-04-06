<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ParsedAPI } from '../parser/types'
import type { CanvasGraph } from '../canvas/types'
import type { BlockId } from '../types'
import BlockWrapper from './blocks/BlockWrapper.vue'
import OverviewBlock from './blocks/OverviewBlock.vue'
import ServersBlock from './blocks/ServersBlock.vue'
import AuthBlock from './blocks/AuthBlock.vue'
import SchemasBlock from './blocks/SchemasBlock.vue'
import ParametersBlock from './blocks/ParametersBlock.vue'
import ResponsesBlock from './blocks/ResponsesBlock.vue'
import CanvapiCanvas from './CanvapiCanvas.vue'

defineProps<{
  api: ParsedAPI
  graph: CanvasGraph
}>()

const hiddenBlocks = ref<Set<BlockId>>(new Set())

function hideBlock(blockId: string) {
  hiddenBlocks.value.add(blockId as BlockId)
}

function showBlock(blockId: BlockId) {
  hiddenBlocks.value.delete(blockId)
}

function isVisible(blockId: BlockId) {
  return !hiddenBlocks.value.has(blockId)
}

const hiddenList = computed(() => Array.from(hiddenBlocks.value))
</script>

<template>
  <div class="canvapi-dashboard">
    <!-- Top row: Overview + Servers + Auth -->
    <div class="canvapi-dashboard__row canvapi-dashboard__row--top">
      <BlockWrapper
        v-if="isVisible('overview')"
        title="Overview"
        block-id="overview"
        @hide="hideBlock"
      >
        <OverviewBlock :info="api.info" />
      </BlockWrapper>

      <BlockWrapper
        v-if="isVisible('servers')"
        title="Servers"
        block-id="servers"
        @hide="hideBlock"
      >
        <ServersBlock :servers="api.servers" />
      </BlockWrapper>

      <BlockWrapper
        v-if="isVisible('auth')"
        title="Auth"
        icon="🔒"
        block-id="auth"
        @hide="hideBlock"
      >
        <AuthBlock :schemes="api.auth" />
      </BlockWrapper>
    </div>

    <!-- Canvas: center, takes most space -->
    <div class="canvapi-dashboard__canvas">
      <CanvapiCanvas :graph="graph" />
    </div>

    <!-- Bottom row: Schemas + Parameters + Responses -->
    <div class="canvapi-dashboard__row canvapi-dashboard__row--bottom">
      <BlockWrapper
        v-if="isVisible('schemas')"
        title="Schemas"
        icon="{ }"
        block-id="schemas"
        @hide="hideBlock"
      >
        <SchemasBlock :schemas="api.schemas" />
      </BlockWrapper>

      <BlockWrapper
        v-if="isVisible('parameters')"
        title="Parameters"
        block-id="parameters"
        @hide="hideBlock"
      >
        <ParametersBlock :resources="api.resources" />
      </BlockWrapper>

      <BlockWrapper
        v-if="isVisible('responses')"
        title="Responses"
        block-id="responses"
        @hide="hideBlock"
      >
        <ResponsesBlock :resources="api.resources" />
      </BlockWrapper>
    </div>

    <!-- Hidden blocks menu -->
    <div v-if="hiddenList.length > 0" class="canvapi-dashboard__hidden">
      <span class="canvapi-dashboard__hidden-label">Hidden:</span>
      <button
        v-for="blockId in hiddenList"
        :key="blockId"
        class="canvapi-dashboard__hidden-btn"
        @click="showBlock(blockId)"
      >
        {{ blockId }} +
      </button>
    </div>
  </div>
</template>
