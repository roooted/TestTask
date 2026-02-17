<template>
  <div class="feedback-section">
    <h3>📋 Feedback</h3>
    <p class="feedback-text">{{ feedback }}</p>
  </div>
</template>

<script setup>
/**
 * Displays feedback text.
 * Props:
 *   feedback: String
 */
import { defineProps } from 'vue';

const props = defineProps({
  feedback: { type: String, required: true }
});
</script>

<style scoped>
/* Reuse feedback-section styles from App.vue */
</style>

