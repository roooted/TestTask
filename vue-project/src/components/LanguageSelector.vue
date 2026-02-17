<template>
  <div class="language-selector">
    <label :for="id">Language:</label>
  <select :id="id" v-model="selected" class="language-select">
      <option value="javascript">JavaScript</option>
      <option value="python">Python</option>
      <option value="java">Java</option>
      <option value="typescript">TypeScript</option>
      <option value="cpp">C++</option>
    </select>
  </div>
</template>

<script setup>
/**
 * Language selector component.
 * Props:
 *   modelValue: currently selected language (v-model binding)
 * Emits:
 *   update:modelValue – to support v-model usage
 */
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: 'javascript'
  },
  id: {
    type: String,
    default: 'language'
  }
});

const emit = defineEmits(['update:modelValue']);

import { computed } from 'vue';
const selected = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  }
});
</script>

<style scoped>
/* Reuse existing styles from App.vue */
</style>
