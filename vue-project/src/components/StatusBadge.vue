<template>
  <span :class="['status-badge', status]">
    {{ badgeText }}
  </span>
</template>

<script setup>
/**
 * Badge displaying review status.
 * Props:
 *   status: string – one of "good", "needs-improvement", "error", etc.
 */
import { defineProps, computed } from 'vue';

const props = defineProps({
  status: { type: String, required: true },
  responseTime: { type: Number, default: 0 }
});

const badgeText = computed(() => {
  if (props.status === 'good') return '✅ Good';
  if (props.status === 'needs-improvement') return '⚠️ Needs Improvement';
  if (props.status === 'error') return '❌ Error';
  return props.status;
});
</script>

<style scoped>
/* Reuse .status-badge styles from App.vue */
</style>

