<template>
  <div class="code-input-section">
    <h2>📝 Paste Your Code</h2>
    <div class="input-container">
      <textarea
        :value="code"
        @input="onCodeInput"
        placeholder="// Paste your code here..."
        class="code-textarea"
        rows="15"
      ></textarea>
      <LanguageSelector
        :modelValue="language"
        @update:modelValue="onLanguageChange"
      />
    </div>

    <div class="controls">
      <button
        @click="submit"
        :disabled="isLoading || !code.trim()"
        class="submit-btn"
      >
        <span v-if="isLoading">⏳ Processing...</span>
        <span v-else>🚀 Send for Code Review</span>
      </button>
      <button @click="clear" class="clear-btn">🗑️ Clear All</button>
    </div>

    <ExamplesSection :loadExample="loadExample" />
  </div>
</template>

<script setup>
/**
 * Code input section component.
 * Props:
 *   code: String – current code text
 *   language: String – selected language
 *   isLoading: Boolean – loading state for disabling submit
 * Emits:
 *   update:code – when textarea changes
 *   update:language – when language selector changes
 *   submit – when user clicks send button
 *   clear – when user clicks clear button
 *   loadExample – when an example button is pressed (index)
 */
import { defineProps, defineEmits } from 'vue';
import LanguageSelector from './LanguageSelector.vue';
import ExamplesSection from './ExamplesSection.vue';

const props = defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: 'javascript' },
  isLoading: { type: Boolean, default: false }
});

const emit = defineEmits([
  'update:code',
  'update:language',
  'submit',
  'clear',
  'loadExample'
]);

function onCodeInput(event) {
  emit('update:code', event.target.value);
}

function onLanguageChange(value) {
  emit('update:language', value);
}

function submit() {
  emit('submit');
}

function clear() {
  emit('clear');
}

function loadExample(index) {
  emit('loadExample', index);
}
</script>

<style scoped>
/* Reuse existing styles from App.vue */
</style>

