<script setup lang="ts">
import { Handle, Position } from '@vue-flow/core'
import type { SchemaNodeData } from '../../canvas/types'

defineProps<{ data: SchemaNodeData }>()
</script>

<template>
  <div class="canvapi-node canvapi-node--schema">
    <div class="canvapi-node__header">
      <span class="canvapi-node__icon">{ }</span>
      <span class="canvapi-node__title">{{ data.name }}</span>
    </div>
    <div class="canvapi-node__body">
      <div
        v-for="prop in data.properties"
        :key="prop.name"
        class="canvapi-schema__prop"
      >
        <span class="canvapi-schema__name">
          {{ prop.name }}
          <span v-if="prop.required" class="canvapi-schema__required">*</span>
        </span>
        <span class="canvapi-schema__type">{{ prop.type }}</span>
        <span v-if="prop.enum" class="canvapi-schema__enum">
          {{ prop.enum.join(' | ') }}
        </span>
      </div>
    </div>
    <Handle type="target" :position="Position.Left" />
    <Handle type="source" :position="Position.Right" />
  </div>
</template>
