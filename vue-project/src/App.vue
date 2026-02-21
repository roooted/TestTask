<template>
  <div class="app">
  <Header />

    <main class="main-content">
      <CodeInputSection
        :code="codeInput"
        :language="selectedLanguage"
        :isLoading="isLoading"
        @update:code="codeInput = $event"
        @update:language="selectedLanguage = $event"
        @submit="submitForReview"
        @clear="clearAll"
        @loadExample="loadExample"
      />
      <ResultsSection :isLoading="isLoading" :reviewResult="reviewResult" />
    </main>

  <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import CodeInputSection from './components/CodeInputSection.vue'
import ResultsSection from './components/ResultsSection.vue'
import { mockAIReview } from './utils/reviewEngine'

const codeInput = ref('')
const selectedLanguage = ref('javascript')
const isLoading = ref(false)
const reviewResult = ref(null)

const submitForReview = async () => {
  if (!codeInput.value.trim()) return

  isLoading.value = true
  reviewResult.value = null

  try {
    const result = await mockAIReview(codeInput.value)
    reviewResult.value = result
  } catch (error) {
    console.error('Review failed:', error)
    reviewResult.value = {
      status: 'error',
      score: 0,
      feedback: 'Failed to analyze code. Please try again.',
      suggestions: [],
      issues: [],
      responseTime: 0
    }
  } finally {
    isLoading.value = false
  }
}

const clearAll = () => {
  codeInput.value = ''
  reviewResult.value = null
}

const loadExample = (index) => {
  const examples = [
    `// Хорошо структурированная функция
function calculateDiscount(price, discountPercentage) {
  const discount = price * (discountPercentage / 100);
  const finalPrice = price - discount;

  if (finalPrice < 0) {
    throw new Error('Invalid price calculation');
  }

  return finalPrice.toFixed(2);
}`,

    `// Код с несколькими проблемами
function process(data) {
  var result = 0;

  for (var i = 0; i < data.length; i++) {
    if (data[i] == null) continue;

    result += data[i].value;
  }

  console.log("Result: " + result);
  return result;
}`,

    `// Уязвимый код с SQL инъекцией
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  // Критическая уязвимость: конкатенация строк
  return database.execute(query);
}`,

    `// Неэффективный алгоритм поиска дубликатов
function findDuplicates(array) {
  const duplicates = [];

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (i !== j && array[i] === array[j]) {
        if (!duplicates.includes(array[i])) {
          duplicates.push(array[i]);
        }
      }
    }
  }

  return duplicates;
}`
  ]

  if (index >= 0 && index < examples.length) {
    codeInput.value = examples[index]
    selectedLanguage.value = 'javascript'
    reviewResult.value = null
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 30px 40px;
  text-align: center;
}

.header h1 {
  font-size: 2.5rem;
  margin-bottom: 10px;
  font-weight: 800;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.main-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 30px;
}

@media (max-width: 900px) {
  .main-content {
    grid-template-columns: 1fr;
  }
}

.code-input-section, .results-section {
  background: #f8f9fa;
  border-radius: 15px;
  padding: 25px;
  border: 2px solid #e9ecef;
}

.code-input-section h2, .results-section h2 {
  color: #495057;
  margin-bottom: 20px;
  font-size: 1.5rem;
}

.input-container {
  margin-bottom: 20px;
}

.code-textarea {
  width: 100%;
  padding: 20px;
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 14px;
  border: 2px solid #dee2e6;
  border-radius: 10px;
  resize: vertical;
  background: white;
  color: #212529;
  transition: border-color 0.3s;
}

.code-textarea:focus {
  outline: none;
  border-color: #667eea;
}

.language-selector {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.language-selector label {
  font-weight: 600;
  color: #495057;
}

.language-select {
  padding: 8px 15px;
  border-radius: 8px;
  border: 2px solid #dee2e6;
  background: white;
  font-weight: 500;
}

.controls {
  display: flex;
  gap: 15px;
}

.submit-btn, .clear-btn {
  flex: 1;
  padding: 15px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.submit-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  background: #e9ecef;
  color: #495057;
}

.clear-btn:hover {
  background: #dee2e6;
}

.examples-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
}

.examples-section h3 {
  color: #495057;
  margin-bottom: 15px;
  font-size: 1.2rem;
}

.example-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (max-width: 768px) {
  .example-buttons {
    grid-template-columns: 1fr;
  }
}

.example-btn {
  padding: 12px 15px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.example-btn:hover {
  transform: translateY(-2px);
  opacity: 0.9;
}

.example-btn.good {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.example-btn.bad {
  background: #fff3cd;
  color: #856404;
  border: 2px solid #ffeaa7;
}

.example-btn.critical {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

.example-btn.warning {
  background: #d1ecf1;
  color: #0c5460;
  border: 2px solid #bee5eb;
}

.loading {
  text-align: center;
  padding: 40px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e9ecef;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.review-result {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.status-badge {
  padding: 8px 15px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 14px;
}

.status-badge.good {
  background: #d4edda;
  color: #155724;
}

.status-badge.needs-improvement {
  background: #fff3cd;
  color: #856404;
}

.time {
  color: #6c757d;
  font-size: 14px;
}

.score {
  text-align: center;
  margin: 30px 0;
}

.score-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: white;
  margin: 0 auto;
  transition: transform 0.3s;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.score-label {
  margin-top: 10px;
  color: #6c757d;
  font-weight: 500;
}

.feedback-section, .suggestions-section, .issues-section {
  margin-top: 25px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.feedback-section h3, .suggestions-section h3, .issues-section h3 {
  color: #495057;
  margin-bottom: 10px;
  font-size: 1.2rem;
}

.feedback-text {
  line-height: 1.6;
  color: #212529;
  padding: 15px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.suggestions-list, .issues-list {
  list-style: none;
  padding-left: 0;
}

.suggestions-list li, .issues-list li {
  padding: 12px 15px;
  margin-bottom: 8px;
  background: white;
  border-radius: 8px;
  border-left: 4px solid #28a745;
}

.issues-list li {
  border-left-color: #dc3545;
}

.line-info {
  display: block;
  font-size: 12px;
  color: #6c757d;
  margin-top: 5px;
}

.empty-state {
  text-align: center;
  padding: 50px 20px;
  color: #6c757d;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  opacity: 0.5;
}

.hint {
  font-size: 0.9rem;
  margin-top: 10px;
  color: #adb5bd;
}

.footer {
  text-align: center;
  padding: 20px;
  background: #f8f9fa;
  color: #6c757d;
  border-top: 2px solid #e9ecef;
}
</style>

