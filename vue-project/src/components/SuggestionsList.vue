<template>
  <div class="suggestions-section" v-if="suggestions && suggestions.length">
    <h3>💡 Suggestions</h3>
    <ul class="suggestions-list">
      <li v-for="(s, i) in suggestions" :key="i">{{ s }}</li>
    </ul>
  </div>
</template>

<script setup>
/**
 * List of suggestion strings.
 * Props:
 *   suggestions: Array<String>
 */
import { defineProps } from 'vue';

const props = defineProps({
  suggestions: { type: Array, default: () => [] }
});
</script>

<style scoped>
/* Reuse suggestions-list styles from App.vue */
</style>

