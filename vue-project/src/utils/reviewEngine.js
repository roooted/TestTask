export const analyzeCodeForAdditionalIssues = (code) => {
  const issues = []
  const lines = code.split('\n')

  lines.forEach((line, index) => {
    if (line.includes('TODO:') || line.includes('FIXME:')) {
      issues.push({
        type: 'Maintenance',
        message: 'Найден TODO/FIXME комментарий, который нужно обработать',
        line: index + 1,
        severity: 'low'
      })
    }

    if (line.length > 120) {
      issues.push({
        type: 'Readability',
        message: 'Строка слишком длинная (>120 символов)',
        line: index + 1,
        severity: 'low'
      })
    }

    if (/\d{3,}/.test(line) && !line.includes('//')) {
      issues.push({
        type: 'Best Practice',
        message: 'Рассмотрите вынос числовых констант в именованные переменные',
        line: index + 1,
        severity: 'medium'
      })
    }
  })

  const functionMatch = code.match(/function\s+\w+\s*\(|const\s+\w+\s*=\s*\(|=>\s*{/g)
  if (functionMatch && lines.length > 50) {
    issues.push({
      type: 'Maintainability',
      message: 'Функция слишком длинная (>50 строк), рассмотрите разделение',
      line: 1,
      severity: 'medium'
    })
  }

  return issues.slice(0, 2)
}

export const detectCodeType = (code) => {
  const securityPatterns = [
    /(?:eval\s*\(|new\s+Function\s*\()/i,
    /innerHTML\s*=/i,
    /\b(sql|query)\b.*(['"]).*\1/i,
    /\b(document|window)\.location\b/i
  ]
  if (securityPatterns.some((re) => re.test(code))) {
    return 'securityIssue'
  }

  const performancePatterns = [
    /for\s*\([^;]+;[^;]+;[^)]*\)\s*{[^}]*for\s*\([^;]+;[^;]+;[^)]*\)/i,
    /while\s*\([^)]*\)\s*{[^}]*while\s*\([^)]*\)/i,
    /Array\.prototype\.map\s*\(/i,
    /Array\.prototype\.filter\s*\(/i,
    /Array\.prototype\.reduce\s*\(/i,
    /\bforEach\b/i
  ]
  if (performancePatterns.some((re) => re.test(code))) {
    return 'performanceIssue'
  }

  const badPatterns = [
    /\bvar\b/,
    /==[^=]/,
    /console\.log\s*\(/i,
    /\bfunction\b[^=]*\{[^}]*\}/i
  ]
  if (badPatterns.some((re) => re.test(code))) {
    return 'badCode'
  }

  const goodPatterns = [
    /\b(const|let)\b/,
    /=>\s*\{/,
    /return\s+/i
  ]
  if (goodPatterns.every((re) => re.test(code))) {
    return 'goodCode'
  }

  return 'badCode'
}

export const mockAIReview = (code) => {
  return new Promise((resolve) => {
    const startTime = Date.now()

    const mockResponses = {
      goodCode: {
        status: 'good',
        score: 9.2,
        feedback: 'Отличный код! Компонент хорошо структурирован, использует современные практики React.',
        suggestions: [
          'Добавить PropTypes или TypeScript типы для пропсов',
          'Рассмотреть возможность использования CSS-in-JS библиотек для стилизации',
          'Добавить тесты для разных вариантов (variant)'
        ],
        issues: [
          {
            type: 'Accessibility',
            message: 'Атрибут aria-label может быть улучшен для screen readers',
            line: 11,
            severity: 'low'
          }
        ],
        responseTime: 1200
      },
      badCode: {
        status: 'needs-improvement',
        score: 4.8,
        feedback: 'Код требует серьезного рефакторинга. Есть несколько критических проблем.',
        suggestions: [
          'Заменить var на const/let для блочной области видимости',
          'Добавить проверку типа входного параметра',
          'Использовать строгое равенство (===) вместо нестрогого',
          'Заменить конкатенацию строк на шаблонные строки',
          'Использовать методы массива (reduce) для суммирования'
        ],
        issues: [
          {
            type: 'Syntax',
            message: 'Использование устаревшего var',
            line: 2,
            severity: 'medium'
          },
          {
            type: 'Best Practice',
            message: 'Отсутствует проверка, что items является массивом',
            line: 1,
            severity: 'high'
          },
          {
            type: 'Performance',
            message: 'console.log в продакшн коде',
            line: 14,
            severity: 'medium'
          }
        ],
        responseTime: 1500
      },
      securityIssue: {
        status: 'critical',
        score: 2.5,
        feedback: 'КРИТИЧЕСКАЯ УЯЗВИМОСТЬ: SQL injection уязвимость!',
        suggestions: [
          'Использовать параметризованные запросы или prepared statements',
          'Валидировать входные параметры',
          'Использовать ORM с защитой от инъекций',
          'Добавить обработку ошибок вместо throw err'
        ],
        issues: [
          {
            type: 'Security',
            message: 'SQL injection через конкатенацию строк в запросе',
            line: 4,
            severity: 'critical'
          },
          {
            type: 'Error Handling',
            message: 'Использование throw в асинхронном коде',
            line: 7,
            severity: 'high'
          }
        ],
        responseTime: 2000
      },
      performanceIssue: {
        status: 'needs-improvement',
        score: 5.5,
        feedback: 'Код имеет серьезные проблемы с производительностью (O(n²)).',
        suggestions: [
          'Использовать Set для отслеживания уникальных значений',
          'Использовать объект Map для подсчета вхождений',
          'Сортировать массив предварительно для оптимизации',
          'Рассмотреть алгоритм с O(n log n) сложностью'
        ],
        issues: [
          {
            type: 'Performance',
            message: 'Вложенные циклы O(n²) на больших массивах',
            line: 5,
            severity: 'high'
          },
          {
            type: 'Performance',
            message: 'includes внутри вложенного цикла добавляет O(n)',
            line: 8,
            severity: 'medium'
          }
        ],
        responseTime: 1300
      }
    }

    const codeType = detectCodeType(code)
    const responseTemplate = mockResponses[codeType]

    const variations = {
      score: () => responseTemplate.score + (Math.random() * 0.6 - 0.3),
      feedback: () => {
        const prefix = ['Отлично!', 'Хорошая работа!', 'Неплохо!', 'Есть над чем поработать!']
        return `${prefix[Math.floor(Math.random() * prefix.length)]} ${responseTemplate.feedback}`
      }
    }

    setTimeout(() => {
      const responseTime = Date.now() - startTime
      const finalResponse = {
        ...responseTemplate,
        score: parseFloat(variations.score().toFixed(1)),
        feedback: variations.feedback(),
        responseTime,
        issues: [...responseTemplate.issues, ...analyzeCodeForAdditionalIssues(code)]
      }
      resolve(finalResponse)
    }, 800 + Math.random() * 1000)
  })
}
