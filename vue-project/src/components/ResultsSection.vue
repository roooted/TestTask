<template>
  <div class="results-section">
    <h2>📊 Review Results</h2>
    <LoadingSpinner v-if="isLoading" />
    <ReviewResult v-else-if="reviewResult" :review="reviewResult" />
    <EmptyState v-else />
  </div>
</template>

<script setup>
/**
 * Handles conditional rendering of loading, result, or empty state.
 * Props:
 *   isLoading: Boolean
 *   reviewResult: Object | null
 */
import { defineProps } from 'vue';
import LoadingSpinner from './LoadingSpinner.vue';
import ReviewResult from './ReviewResult.vue';
import EmptyState from './EmptyState.vue';

const props = defineProps({
  isLoading: { type: Boolean, default: false },
  reviewResult: { type: Object, default: null }
});
</script>

<style scoped>
/* Reuse results-section styles from App.vue */
</style>

