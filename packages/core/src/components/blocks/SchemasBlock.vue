<script setup lang="ts">
import { ref } from 'vue'
import type { Schema } from '../../parser/types'

defineProps<{ schemas: Schema[] }>()

const expandedSchema = ref<string | null>(null)

function toggle(name: string) {
  expandedSchema.value = expandedSchema.value === name ? null : name
}
</script>

<template>
  <div class="canvapi-schemas-block">
    <div v-for="schema in schemas" :key="schema.name" class="canvapi-schemas-block__item">
      <div class="canvapi-schemas-block__header" @click="toggle(schema.name)">
        <span class="canvapi-schemas-block__arrow">{{ expandedSchema === schema.name ? '▾' : '▸' }}</span>
        <span class="canvapi-schemas-block__name">{{ schema.name }}</span>
        <span class="canvapi-schemas-block__count">{{ Object.keys(schema.properties).length }} props</span>
      </div>
      <div v-if="expandedSchema === schema.name" class="canvapi-schemas-block__props">
        <div v-for="(prop, propName) in schema.properties" :key="propName" class="canvapi-schemas-block__prop">
          <span class="canvapi-schemas-block__prop-name">
            {{ propName }}
            <span v-if="schema.required.includes(String(propName))" class="canvapi-schemas-block__required">*</span>
          </span>
          <span class="canvapi-schemas-block__prop-type">{{ prop.type ?? 'object' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
