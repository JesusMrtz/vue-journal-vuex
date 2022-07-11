import { shallowMount } from "@vue/test-utils"
import HomeView from '@/views/HomeView'

describe('Pruebas en el FabComponent', () => {
  it ('Debe de renderizar el componente correctamente', () => {
    const wrapper = shallowMount(HomeView)

    expect(wrapper.html()).toMatchSnapshot()
  })


  it ('Hacer click en un botón debe redireccionar a no-entry', async () => {
    const mockRouter = {
      push: jest.fn()
    }

    const wrapper = shallowMount(HomeView, {
      global: {
        mocks: {
          // Hacer que la variable router apunte al mock
          $router: mockRouter
        }
      }
    })

    await wrapper.find('button').trigger('click')

    expect(mockRouter.push).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'no-entry' })
  })
})