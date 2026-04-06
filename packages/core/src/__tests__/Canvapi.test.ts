import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Canvapi from '../Canvapi.vue'

describe('Canvapi', () => {
  it('renders with default props', () => {
    const wrapper = mount(Canvapi, {
      props: {
        specUrl: '/openapi.json',
      },
    })
    expect(wrapper.find('.canvapi').exists()).toBe(true)
  })

  it('applies dark theme by default', () => {
    const wrapper = mount(Canvapi, {
      props: {
        specUrl: '/openapi.json',
      },
    })
    expect(wrapper.find('.canvapi').attributes('data-theme')).toBe('dark')
  })

  it('applies light theme when specified', () => {
    const wrapper = mount(Canvapi, {
      props: {
        specUrl: '/openapi.json',
        theme: 'light',
      },
    })
    expect(wrapper.find('.canvapi').attributes('data-theme')).toBe('light')
  })
})
