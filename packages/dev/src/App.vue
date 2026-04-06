<script setup lang="ts">
import { Canvapi } from '@canvapi/core'
</script>

<template>
  <Canvapi spec-url="/openapi.json" theme="dark" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
html, body, #app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
