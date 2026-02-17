<template>
  <div class="examples-section">
    <h3>🔄 Test Examples</h3>
    <div class="example-buttons">
      <button @click="load(0)" class="example-btn good">✅ Good Code</button>
      <button @click="load(1)" class="example-btn bad">⚠️ Bad Code</button>
      <button @click="load(2)" class="example-btn critical">🔥 Security Issue</button>
      <button @click="load(3)" class="example-btn warning">🐌 Performance</button>
    </div>
  </div>
</template>

<script setup>
/**
 * Examples section component.
 * Props:
 *   loadExample: Function that receives the example index.
 */
import { defineProps } from 'vue';

const props = defineProps({
  loadExample: {
    type: Function,
    required: true
  }
});

function load(index) {
  props.loadExample(index);
}
</script>

<style scoped>
/* Reuse existing styles from App.vue */
</style>

