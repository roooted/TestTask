// src/components/__tests__/CodeInputSection.spec.js
import { mount } from '@vue/test-utils'
import CodeInputSection from '../CodeInputSection.vue'
// Import Vitest globals explicitly to satisfy ESLint and avoid "describe is not defined"
// Vitest globals (describe, it, expect) are enabled via vitest.config.js (globals: true)

// Заглушки для дочерних компонентов
// Stubs for child components used in CodeInputSection tests.
const stubs = {
  // LanguageSelector stub mimics a simple <select> that reflects the passed modelValue
  // and emits the expected "update:modelValue" event on change.
  LanguageSelector: {
    // Simple select that emits the expected "update:modelValue" event on change.
    // Explicit options are provided so setValue can select "python" during the test.
    // Using v-model on the select ensures Vue emits "update:modelValue" automatically when the value changes.
    // Bind the select's value to the passed prop so the initial state matches the prop.
    // Emit "update:modelValue" on change to mimic the real LanguageSelector component.
    // Emit on both input and change to cover the events triggered by Vue Test Utils' setValue.
    template: `
      <select data-testid="language-select" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @change="$emit('update:modelValue', $event.target.value)">
        <option value="javascript">javascript</option>
        <option value="python">python</option>
      </select>
    `,
    props: ['modelValue']
  },
  // ExamplesSection receives a prop `loadExample` (function) and calls it on button click.
  ExamplesSection: {
    props: ['loadExample'],
    template: `
      <div data-testid="examples-section">
        <button
          v-for="n in 4"
          :key="n"
          data-testid="example-btn"
          @click="loadExample(n - 1)"
        >Example {{ n }}</button>
      </div>`
  }
}

describe('CodeInputSection', () => {
  it('отображает переданные пропсы code и language', () => {
    const code = 'const x = 42;'
    const language = 'python'
    const wrapper = mount(CodeInputSection, {
      props: { code, language, isLoading: false },
      global: { stubs }
    })

    const textarea = wrapper.find('textarea')
    const languageSelect = wrapper.find('[data-testid="language-select"]')

    expect(textarea.element.value).toBe(code)
    expect(languageSelect.element.value).toBe(language)
  })

  it('при вводе текста эмитит событие update:code', async () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: '', language: 'javascript', isLoading: false },
      global: { stubs }
    })

    const textarea = wrapper.find('textarea')
    await textarea.setValue('function test() {}')

    expect(wrapper.emitted('update:code')).toBeTruthy()
    expect(wrapper.emitted('update:code')[0]).toEqual(['function test() {}'])
  })

  it('при изменении языка эмитит событие update:language', async () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: 'test', language: 'javascript', isLoading: false },
      global: { stubs }
    })

    const languageSelect = wrapper.find('[data-testid="language-select"]')
    await languageSelect.setValue('python') // вызовет изменение значения

    expect(wrapper.emitted('update:language')).toBeTruthy()
    expect(wrapper.emitted('update:language')[0]).toEqual(['python'])
  })

  it('кнопка отправки неактивна при пустом коде', () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: '', language: 'javascript', isLoading: false },
      global: { stubs }
    })

    const submitBtn = wrapper.find('.submit-btn')
    expect(submitBtn.attributes('disabled')).toBeDefined()
  })

  it('кнопка отправки неактивна во время загрузки (isLoading=true)', () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: 'some code', language: 'javascript', isLoading: true },
      global: { stubs }
    })

    const submitBtn = wrapper.find('.submit-btn')
    expect(submitBtn.attributes('disabled')).toBeDefined()
  })

  it('кнопка отправки активна при непустом коде и не в загрузке', () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: 'some code', language: 'javascript', isLoading: false },
      global: { stubs }
    })

    const submitBtn = wrapper.find('.submit-btn')
    expect(submitBtn.attributes('disabled')).toBeUndefined()
  })

  it('клик по кнопке отправки вызывает событие submit', async () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: 'some code', language: 'javascript', isLoading: false },
      global: { stubs }
    })

    await wrapper.find('.submit-btn').trigger('click')
    expect(wrapper.emitted('submit')).toBeTruthy()
  })

  it('клик по кнопке очистки вызывает событие clear', async () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: 'some code', language: 'javascript', isLoading: false },
      global: { stubs }
    })

    await wrapper.find('.clear-btn').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('клик по кнопке примера вызывает событие loadExample с правильным индексом', async () => {
    const wrapper = mount(CodeInputSection, {
      props: { code: '', language: 'javascript', isLoading: false },
      global: { stubs }
    })

    const exampleBtns = wrapper.findAll('[data-testid="example-btn"]')
    expect(exampleBtns).toHaveLength(4)

    // Клик по второй кнопке (индекс 1)
    await exampleBtns[1].trigger('click')

    expect(wrapper.emitted('loadExample')).toBeTruthy()
    expect(wrapper.emitted('loadExample')[0]).toEqual([1])
  })
})
