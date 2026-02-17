<template>
  <div class="score-circle" :style="circleStyle">
    {{ score }}/10
  </div>
</template>

<script setup>
/**
 * Circular score visualizer.
 * Props:
 *   score: Number (0-10)
 */
import { defineProps, computed } from 'vue';

const props = defineProps({
  score: { type: Number, required: true }
});

const circleStyle = computed(() => {
  const hue = (props.score / 10) * 120;
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue}, 80%, 40%))`,
    transform: `scale(${0.9 + (props.score / 10) * 0.2})`
  };
});
</script>

<style scoped>
/* Reuse .score-circle styles from App.vue */
</style>

