<template>
  <div class="issues-section" v-if="issues && issues.length">
    <h3>⚠️ Issues Found</h3>
    <ul class="issues-list">
      <li v-for="(issue, i) in issues" :key="i">
        <strong>{{ issue.type }}:</strong> {{ issue.message }}
        <span v-if="issue.line" class="line-info">(Line {{ issue.line }})</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
/**
 * List of issue objects.
 * Props:
 *   issues: Array<Object>
 */
import { defineProps } from 'vue';

const props = defineProps({
  issues: { type: Array, default: () => [] }
});
</script>

<style scoped>
/* Reuse issues-list styles from App.vue */
</style>

