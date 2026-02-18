import { mount } from '@vue/test-utils'
import Footer from '../Footer.vue'

describe('Footer', () => {
  it('renders default footer content', () => {
    const wrapper = mount(Footer)
    // Assuming Footer contains a <footer> element with some text
    const footer = wrapper.find('footer')
    expect(footer.exists()).toBe(true)
  })
})
