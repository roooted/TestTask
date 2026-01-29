<template>
  <div class="app">
    <header class="header">
      <h1>🤖 AI Code Review Assistant</h1>
      <p class="subtitle">Get instant feedback on your code from AI assistant</p>
    </header>

    <main class="main-content">
      <div class="code-input-section">
        <h2>📝 Paste Your Code</h2>
        <div class="input-container">
          <textarea
            v-model="codeInput"
            placeholder="// Paste your code here...
// Example:
function calculateSum(a, b) {
  return a + b;
}"
            class="code-textarea"
            rows="15"
          ></textarea>
          <div class="language-selector">
            <label for="language">Language:</label>
            <select id="language" v-model="selectedLanguage" class="language-select">
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="typescript">TypeScript</option>
              <option value="cpp">C++</option>
            </select>
          </div>
        </div>
        
        <div class="controls">
          <button 
            @click="submitForReview" 
            :disabled="isLoading || !codeInput.trim()"
            class="submit-btn"
          >
            <span v-if="isLoading">⏳ Processing...</span>
            <span v-else>🚀 Send for Code Review</span>
          </button>
          <button @click="clearAll" class="clear-btn">🗑️ Clear All</button>
        </div>

        <div class="examples-section">
          <h3>🔄 Test Examples</h3>
          <div class="example-buttons">
            <button @click="loadExample(0)" class="example-btn good">✅ Good Code</button>
            <button @click="loadExample(1)" class="example-btn bad">⚠️ Bad Code</button>
            <button @click="loadExample(2)" class="example-btn critical">🔥 Security Issue</button>
            <button @click="loadExample(3)" class="example-btn warning">🐌 Performance</button>
          </div>
        </div>
      </div>

      <div class="results-section">
        <h2>📊 Review Results</h2>
        
        <div v-if="isLoading" class="loading">
          <div class="spinner"></div>
          <p>AI is analyzing your code...</p>
        </div>

        <div v-else-if="reviewResult" class="review-result">
          <div class="result-header">
            <span class="status-badge" :class="reviewResult.status">
              {{ reviewResult.status === 'good' ? '✅ Good' : '⚠️ Needs Improvement' }}
            </span>
            <span class="time">⏱️ {{ reviewResult.responseTime }}ms</span>
          </div>
          
          <div class="score">
            <div class="score-circle" :style="scoreStyle">
              {{ reviewResult.score }}/10
            </div>
            <p class="score-label">Overall Code Quality</p>
          </div>

          <div class="feedback-section">
            <h3>📋 Feedback</h3>
            <p class="feedback-text">{{ reviewResult.feedback }}</p>
          </div>

          <div class="suggestions-section" v-if="reviewResult.suggestions.length">
            <h3>💡 Suggestions</h3>
            <ul class="suggestions-list">
              <li v-for="(suggestion, index) in reviewResult.suggestions" :key="index">
                {{ suggestion }}
              </li>
            </ul>
          </div>

          <div class="issues-section" v-if="reviewResult.issues.length">
            <h3>⚠️ Issues Found</h3>
            <ul class="issues-list">
              <li v-for="(issue, index) in reviewResult.issues" :key="index">
                <strong>{{ issue.type }}:</strong> {{ issue.message }}
                <span v-if="issue.line" class="line-info">(Line {{ issue.line }})</span>
              </li>
            </ul>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-icon">👨‍💻</div>
          <p>Submit your code to get AI-powered review</p>
          <p class="hint">Try pasting some code and click "Send for Code Review"</p>
        </div>
      </div>
    </main>

    <footer class="footer">
      <p>AI Code Review Assistant v1.0 • Mock data simulation</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Reactive state
const codeInput = ref('')
const selectedLanguage = ref('javascript')
const isLoading = ref(false)
const reviewResult = ref(null)

// Вспомогательная функция для анализа кода
const analyzeCodeForAdditionalIssues = (code, language) => {
  const issues = []
  const lines = code.split('\n')
  
  lines.forEach((line, index) => {
    // Проверка на комментарии TODO/FIXME
    if (line.includes('TODO:') || line.includes('FIXME:')) {
      issues.push({
        type: 'Maintenance',
        message: 'Найден TODO/FIXME комментарий, который нужно обработать',
        line: index + 1,
        severity: 'low'
      })
    }
    
    // Проверка на длинные строки
    if (line.length > 120) {
      issues.push({
        type: 'Readability',
        message: 'Строка слишком длинная (>120 символов)',
        line: index + 1,
        severity: 'low'
      })
    }
    
    // Проверка на магические числа
    if (/\d{3,}/.test(line) && !line.includes('//')) {
      issues.push({
        type: 'Best Practice',
        message: 'Рассмотрите вынос числовых констант в именованные переменные',
        line: index + 1,
        severity: 'medium'
      })
    }
  })
  
  // Проверка размера функции
  const functionMatch = code.match(/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*{/g)
  if (functionMatch && lines.length > 50) {
    issues.push({
      type: 'Maintainability',
      message: 'Функция слишком длинная (>50 строк), рассмотрите разделение',
      line: 1,
      severity: 'medium'
    })
  }
  
  return issues.slice(0, 2) // Ограничиваем количество дополнительных проблем
}

// Mock AI function (simulates API call)
const mockAIReview = (code, language) => {
  return new Promise((resolve) => {
    const startTime = Date.now()
    
    // Детектируем тип кода для выбора подходящего ответа
    const detectCodeType = (code) => {
      const lowerCode = code.toLowerCase()
      
      if (lowerCode.includes('sql') || lowerCode.includes('select *') || lowerCode.includes('query(')) {
        return 'securityIssue'
      }
      
      if (lowerCode.includes('for.*for') || code.includes('nested') || code.includes('o(n²)')) {
        return 'performanceIssue'
      }
      
      if (lowerCode.includes('var ') || lowerCode.includes('console.log') || lowerCode.includes('==')) {
        return 'badCode'
      }
      
      if (lowerCode.includes('function') && lowerCode.includes('return') && 
          !lowerCode.includes('var ') && (lowerCode.includes('const ') || lowerCode.includes('let '))) {
        return 'goodCode'
      }
      
      return 'badCode' // по умолчанию
    }
    
    // Моковые ответы
    const mockResponses = {
      goodCode: {
        status: "good",
        score: 9.2,
        feedback: "Отличный код! Компонент хорошо структурирован, использует современные практики React.",
        suggestions: [
          "Добавить PropTypes или TypeScript типы для пропсов",
          "Рассмотреть возможность использования CSS-in-JS библиотек для стилизации",
          "Добавить тесты для разных вариантов (variant)"
        ],
        issues: [
          {
            type: "Accessibility",
            message: "Атрибут aria-label может быть улучшен для screen readers",
            line: 11,
            severity: "low"
          }
        ],
        responseTime: 1200
      },
      badCode: {
        status: "needs-improvement",
        score: 4.8,
        feedback: "Код требует серьезного рефакторинга. Есть несколько критических проблем.",
        suggestions: [
          "Заменить var на const/let для блочной области видимости",
          "Добавить проверку типа входного параметра",
          "Использовать строгое равенство (===) вместо нестрогого",
          "Заменить конкатенацию строк на шаблонные строки",
          "Использовать методы массива (reduce) для суммирования"
        ],
        issues: [
          {
            type: "Syntax",
            message: "Использование устаревшего var",
            line: 2,
            severity: "medium"
          },
          {
            type: "Best Practice",
            message: "Отсутствует проверка, что items является массивом",
            line: 1,
            severity: "high"
          },
          {
            type: "Performance",
            message: "console.log в продакшн коде",
            line: 14,
            severity: "medium"
          }
        ],
        responseTime: 1500
      },
      securityIssue: {
        status: "critical",
        score: 2.5,
        feedback: "КРИТИЧЕСКАЯ УЯЗВИМОСТЬ: SQL injection уязвимость!",
        suggestions: [
          "ИСПОЛЬЗОВАТЬ параметризованные запросы или prepared statements",
          "Валидировать входные параметры",
          "Использовать ORM с защитой от инъекций",
          "Добавить обработку ошибок вместо throw err"
        ],
        issues: [
          {
            type: "Security",
            message: "SQL injection через конкатенацию строк в запросе",
            line: 4,
            severity: "critical"
          },
          {
            type: "Error Handling",
            message: "Использование throw в асинхронном коде",
            line: 7,
            severity: "high"
          }
        ],
        responseTime: 2000
      },
      performanceIssue: {
        status: "needs-improvement",
        score: 5.5,
        feedback: "Код имеет серьезные проблемы с производительностью (O(n²)).",
        suggestions: [
          "Использовать Set для отслеживания уникальных значений",
          "Использовать объект Map для подсчета вхождений",
          "Сортировать массив предварительно для оптимизации",
          "Рассмотреть алгоритм с O(n log n) сложностью"
        ],
        issues: [
          {
            type: "Performance",
            message: "Вложенные циклы O(n²) на больших массивах",
            line: 5,
            severity: "high"
          },
          {
            type: "Performance",
            message: "includes внутри вложенного цикла добавляет O(n)",
            line: 8,
            severity: "medium"
          }
        ],
        responseTime: 1300
      }
    }
    
    const codeType = detectCodeType(code)
    const responseTemplate = mockResponses[codeType]
    
    // Добавляем немного вариативности для реалистичности
    const variations = {
      score: () => responseTemplate.score + (Math.random() * 0.6 - 0.3),
      feedback: () => {
        const prefix = ["Отлично!", "Хорошая работа!", "Неплохо!", "Есть над чем поработать!"]
        return `${prefix[Math.floor(Math.random() * prefix.length)]} ${responseTemplate.feedback}`
      }
    }
    
    // Имитируем анализ кода (задержка)
    setTimeout(() => {
      const responseTime = Date.now() - startTime
      
      // Случайные модификации ответа для реалистичности
      const finalResponse = {
        ...responseTemplate,
        score: parseFloat(variations.score().toFixed(1)),
        feedback: variations.feedback(),
        responseTime: responseTime,
        
        // Добавляем дополнительные найденные проблемы на основе анализа
        issues: [...responseTemplate.issues, ...analyzeCodeForAdditionalIssues(code, language)]
      }
      
      resolve(finalResponse)
    }, 800 + Math.random() * 1000) // Случайная задержка 0.8-1.8 секунды
  })
}

// Submit code for review
const submitForReview = async () => {
  if (!codeInput.value.trim()) return
  
  isLoading.value = true
  reviewResult.value = null
  
  try {
    const result = await mockAIReview(codeInput.value, selectedLanguage.value)
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

// Clear all inputs and results
const clearAll = () => {
  codeInput.value = ''
  reviewResult.value = null
}

// Computed property for score circle style
const scoreStyle = computed(() => {
  if (!reviewResult.value) return {}
  const score = reviewResult.value.score
  const hue = (score / 10) * 120 // 0 = red, 120 = green
  return {
    background: `linear-gradient(135deg, hsl(${hue}, 70%, 60%), hsl(${hue}, 80%, 40%))`,
    transform: `scale(${0.9 + (score / 10) * 0.2})`
  }
})

// Функция для загрузки примеров кода
const loadExample = (index) => {
  // Простые примеры без JSX и сложных символов
  const examples = [
    // Пример 1: Хороший код
    `// Хорошо структурированная функция
function calculateDiscount(price, discountPercentage) {
  const discount = price * (discountPercentage / 100);
  const finalPrice = price - discount;
  
  if (finalPrice < 0) {
    throw new Error('Invalid price calculation');
  }
  
  return finalPrice.toFixed(2);
}`,

    // Пример 2: Код с ошибками
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

    // Пример 3: Уязвимость безопасности
    `// Уязвимый код с SQL инъекцией
function getUserData(userId) {
  const query = "SELECT * FROM users WHERE id = " + userId;
  // Критическая уязвимость: конкатенация строк
  return database.execute(query);
}`,

    // Пример 4: Проблемы производительности
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