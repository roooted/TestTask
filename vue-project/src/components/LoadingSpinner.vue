<template>
  <div class="loading">
    <div class="spinner"></div>
    <p>AI is analyzing your code...</p>
  </div>
</template>

<script setup>
// No script needed; purely presentational
</script>

<style scoped>
/* Reuse spinner styles from App.vue */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecee;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}
</style>

