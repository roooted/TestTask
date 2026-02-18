import { mount } from '@vue/test-utils'
import LoadingSpinner from '../LoadingSpinner.vue'

describe('LoadingSpinner', () => {
  it('renders spinner element', () => {
    const wrapper = mount(LoadingSpinner)
    // Assuming component renders an element with class .spinner
    expect(wrapper.find('.spinner').exists()).toBe(true)
  })
})
