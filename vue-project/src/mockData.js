// Набор примеров кода для тестирования
export const codeExamples = [
  {
    name: "Хороший код (React компонент)",
    code: `function Button({ onClick, children, variant = 'primary' }) {
  const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-500 text-white hover:bg-red-600'
  };
  
  return (
    <button 
      className={\`\${baseClasses} \${variantClasses[variant]}\`}
      onClick={onClick}
      aria-label={typeof children === 'string' ? children : 'button'}
    >
      {children}
    </button>
  );
}`,
    language: "javascript"
  },
  {
    name: "Код с ошибками",
    code: `function calculate(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    if (items[i].price) {
      total = total + items[i].price;
    }
  }
  
  // Проблемы:
  // 1. var вместо const/let
  // 2. Нет проверки на массив
  // 3. Использование == вместо ===
  // 4. Нет обработки ошибок
  
  console.log('Total: ' + total);
  return total;
}`,
    language: "javascript"
  },
  {
    name: "Код с уязвимостью безопасности",
    code: `app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = 'SELECT * FROM users WHERE id = ' + userId;
  
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});`,
    language: "javascript"
  },
  {
    name: "Код с проблемами производительности",
    code: `function findDuplicates(arr) {
  const duplicates = [];
  
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
      if (i !== j && arr[i] === arr[j]) {
        if (!duplicates.includes(arr[i])) {
          duplicates.push(arr[i]);
        }
      }
    }
  }
  
  return duplicates;
}`,
    language: "javascript"
  }
];

// Моковые ответы AI для разных типов кода
export const mockResponses = {
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
};

// Детектор типов кода для выбора правильного ответа
export function detectCodeType(code) {
  const lowerCode = code.toLowerCase();
  
  if (lowerCode.includes('sql') || lowerCode.includes('select *') || lowerCode.includes('query(')) {
    return 'securityIssue';
  }
  
  if (lowerCode.includes('for.*for') || lowerCode.includes('nested') || lowerCode.includes('o(n²)')) {
    return 'performanceIssue';
  }
  
  if (lowerCode.includes('var ') || lowerCode.includes('console.log') || lowerCode.includes('==')) {
    return 'badCode';
  }
  
  if (lowerCode.includes('function') && lowerCode.includes('return') && 
      !lowerCode.includes('var ') && lowerCode.includes('const ') || lowerCode.includes('let ')) {
    return 'goodCode';
  }
  
  return 'badCode'; // по умолчанию
}