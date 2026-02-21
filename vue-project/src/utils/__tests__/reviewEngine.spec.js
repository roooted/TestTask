import {
  analyzeCodeForAdditionalIssues,
  detectCodeType,
  mockAIReview
} from '../reviewEngine'

describe('detectCodeType', () => {
  it('returns securityIssue for eval/new Function/innerHTML/document.location', () => {
    expect(detectCodeType('const x = eval("2+2")')).toBe('securityIssue')
    expect(detectCodeType('const f = new Function("a", "return a")')).toBe('securityIssue')
    expect(detectCodeType('node.innerHTML = userInput')).toBe('securityIssue')
    expect(detectCodeType('window.location = redirectUrl')).toBe('securityIssue')
  })

  it('returns securityIssue for query pattern', () => {
    expect(detectCodeType("query 'query'")).toBe('securityIssue')
  })

  it('returns performanceIssue for nested loops and heavy patterns', () => {
    expect(
      detectCodeType('for (let i=0;i<10;i++) { for (let j=0;j<10;j++) { total += j } }')
    ).toBe('performanceIssue')
    expect(detectCodeType('items.forEach((x) => x + 1)')).toBe('performanceIssue')
    expect(detectCodeType('Array.prototype.reduce((acc, x) => acc + x, 0)')).toBe('performanceIssue')
  })

  it('returns badCode for var, ==, console.log and simple function body', () => {
    expect(detectCodeType('var x = 1')).toBe('badCode')
    expect(detectCodeType('if (a == b) return true')).toBe('badCode')
    expect(detectCodeType('console.log("debug")')).toBe('badCode')
    expect(detectCodeType('function f(){ return 1 }')).toBe('badCode')
  })

  it('returns goodCode for const/let + arrow + return', () => {
    const code = 'const sum = (a, b) => { return a + b }'
    expect(detectCodeType(code)).toBe('goodCode')
  })

  it('keeps priority: security over performance/bad/good', () => {
    const code = 'eval("1"); forEach(() => {}); var x = 1; const y = () => { return 1 }'
    expect(detectCodeType(code)).toBe('securityIssue')
  })

  it('falls back to badCode', () => {
    expect(detectCodeType('let a')).toBe('badCode')
  })
})

describe('analyzeCodeForAdditionalIssues', () => {
  it('detects TODO/FIXME with line number', () => {
    const issues = analyzeCodeForAdditionalIssues('const a = 1\n// TODO: refactor')
    expect(issues[0].type).toBe('Maintenance')
    expect(issues[0].line).toBe(2)
  })

  it('detects long line > 120', () => {
    const longLine = `const x = "${'a'.repeat(121)}"`
    const issues = analyzeCodeForAdditionalIssues(longLine)
    expect(issues.some((x) => x.type === 'Readability')).toBe(true)
  })

  it('detects magic numbers outside comments only', () => {
    const issues = analyzeCodeForAdditionalIssues('// 1234\nconst timeout = 1234')
    expect(issues.some((x) => x.type === 'Best Practice')).toBe(true)
    expect(issues.filter((x) => x.type === 'Best Practice')).toHaveLength(1)
  })

  it('detects long function when code has function pattern and > 50 lines', () => {
    const body = Array.from({ length: 51 }, () => 'const x = 1').join('\n')
    const code = `function test(){\n${body}\n}`
    const issues = analyzeCodeForAdditionalIssues(code)
    expect(issues.some((x) => x.type === 'Maintainability')).toBe(true)
  })

  it('limits additional issues to 2', () => {
    const noisyLine = `// TODO: ${'a'.repeat(130)} 1234`
    const issues = analyzeCodeForAdditionalIssues(`${noisyLine}\nconst y = 4567`)
    expect(issues.length).toBeLessThanOrEqual(2)
  })

  it('returns empty array for empty/short clean code', () => {
    expect(analyzeCodeForAdditionalIssues('')).toEqual([])
    expect(analyzeCodeForAdditionalIssues('const x = 1')).toEqual([])
  })
})

describe('mockAIReview', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  it('returns deterministic structure and rounds score to one decimal', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(1000).mockReturnValue(1800)
    const promise = mockAIReview('const sum = (a, b) => { return a + b }')
    vi.advanceTimersByTime(800)
    const result = await promise

    expect(result).toMatchObject({
      status: expect.any(String),
      score: expect.any(Number),
      feedback: expect.any(String),
      suggestions: expect.any(Array),
      issues: expect.any(Array),
      responseTime: 800
    })
    expect(Number.isInteger(result.score * 10)).toBe(true)
  })

  it('returns expected status for each code type', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(2000).mockReturnValue(2800)
    const s1 = mockAIReview('eval("1+1")')
    vi.advanceTimersByTime(800)
    await expect(s1).resolves.toMatchObject({ status: 'critical' })

    vi.spyOn(Date, 'now').mockReturnValueOnce(3000).mockReturnValue(3800)
    const s2 = mockAIReview('for (let i=0;i<2;i++) { for (let j=0;j<2;j++) {} }')
    vi.advanceTimersByTime(800)
    await expect(s2).resolves.toMatchObject({ status: 'needs-improvement' })

    vi.spyOn(Date, 'now').mockReturnValueOnce(4000).mockReturnValue(4800)
    const s3 = mockAIReview('var x = 1')
    vi.advanceTimersByTime(800)
    await expect(s3).resolves.toMatchObject({ status: 'needs-improvement' })

    vi.spyOn(Date, 'now').mockReturnValueOnce(5000).mockReturnValue(5800)
    const s4 = mockAIReview('const sum = (a, b) => { return a + b }')
    vi.advanceTimersByTime(800)
    await expect(s4).resolves.toMatchObject({ status: 'good' })
  })

  it('appends additional issues from code analysis', async () => {
    vi.spyOn(Date, 'now').mockReturnValueOnce(6000).mockReturnValue(6800)
    const code = 'var x = 1\n// TODO: cleanup'
    const promise = mockAIReview(code)
    vi.advanceTimersByTime(800)
    const result = await promise

    expect(result.issues.length).toBeGreaterThan(3)
    expect(result.issues.some((x) => x.type === 'Maintenance')).toBe(true)
  })
})
