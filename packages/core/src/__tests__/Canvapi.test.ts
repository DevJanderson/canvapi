import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Canvapi from '../Canvapi.vue'

describe('Canvapi', () => {
  it('renders', () => {
    const wrapper = mount(Canvapi)
    expect(wrapper.element).toBeDefined()
  })
})
