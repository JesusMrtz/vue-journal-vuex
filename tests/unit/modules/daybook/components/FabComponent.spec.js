import { shallowMount } from "@vue/test-utils"
import FabComponent from '@/modules/daybook/components/FabComponent'

describe('Pruebas en el FabComponent', () => {
  it ('Debe de renderizar el componente correctamente', () => {
    const wrapper = shallowMount(FabComponent)

    expect(wrapper.html()).toMatchSnapshot()
  })

  it ('Debe de mostar el ícono por defecto', () => {
    const wrapper = shallowMount(FabComponent)
    const li = wrapper.find('i')

    expect( li.classes('fa-plus') ).toBeTruthy()
  })

  it ('Debe de mostar el ícono fa-save ', () => {
    const wrapper = shallowMount(FabComponent, {
      props: {
        icon: 'fa-save'
      }
    })
    const li = wrapper.find('i')

    expect( li.classes('fa-save') ).toBeTruthy()
  })
})