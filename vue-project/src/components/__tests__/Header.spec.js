import { mount } from '@vue/test-utils'
import Header from '../Header.vue'

describe('Header', () => {
  it('renders title prop', () => {
    const wrapper = mount(Header, {
      props: { title: 'Test Title' }
    })
    expect(wrapper.find('h1').text()).toBe('Test Title')
  })

  it('renders subtitle when provided', () => {
    const wrapper = mount(Header, {
      props: { title: 'Title', subtitle: 'Subtitle' }
    })
    const subtitle = wrapper.find('.subtitle')
    expect(subtitle.exists()).toBe(true)
    expect(subtitle.text()).toBe('Subtitle')
  })

  it('does not render subtitle element when subtitle prop is empty', () => {
    const wrapper = mount(Header, {
      props: { title: 'Title' }
    })
    expect(wrapper.find('.subtitle').exists()).toBe(false)
  })
})
