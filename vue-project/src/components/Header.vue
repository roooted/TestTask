<template>
  <header class="header">
    <h1>{{ title }}</h1>
    <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
  </header>
</template>

<script setup>
/**
 * Header component displaying a title and optional subtitle.
 * Props:
 *   title: string (default "🤖 AI Code Review Assistant")
 *   subtitle: string (optional)
 */
defineProps({
  title: {
    type: String,
    default: '🤖 AI Code Review Assistant'
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

<style scoped>
/* No extra styles – inherits global .header styles */
</style>

