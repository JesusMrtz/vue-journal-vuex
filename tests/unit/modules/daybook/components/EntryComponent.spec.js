import { shallowMount } from "@vue/test-utils"
import EntryComponent from '@/modules/daybook/components/EntryComponent'

describe('Pruebas en el componente EntryComponent', () => {
  let wrapper;
  let mockRouter

  beforeEach(() => {
    mockRouter = {
      push: jest.fn()
    }

    wrapper = shallowMount(EntryComponent, {
      props: {
        entry: {
          id: '-N68Xkr1grhuC7zXKH4j',
          picture: 'https://res.cloudinary.com/dx0pryfzn/upload/sample.jpg',
          date: 1627077239523,
          text: 'Esta es la segunda entrada'
        }
      },
      global: {
        mocks: {
          $router: mockRouter
        }
      }
    })
  })
  
  
  it('Debe de hacer match con el  snapshot', () => {
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Debe de redireccionar al hacer click en la clase entry-container', async () => {
    await wrapper.find('.entry-container').trigger('click')


    expect(mockRouter.push).toHaveBeenCalled()
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'entry', params: { id: '-N68Xkr1grhuC7zXKH4j' } })
  })

  it('Debemos tener las propiedades computadas del año', () => {
    const { day, month, yearDate } = wrapper.vm

    expect(day).toBe(23)
    expect(month).toBe('Julio')
    expect(yearDate).toBe('2021, Viernes')
  })
})