import { shallowMount } from "@vue/test-utils"
import NavbarComponent from '@/modules/daybook/components/NavbarComponent'
import createVuexStore from "../../../mocks/mock-store"


const mockRouter = {
  push: jest.fn()
}

jest.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

describe('Pruebas en el Navbar component', () => {
  const store = createVuexStore({
    user: {
      name: 'Jesús',
      email: 'correo@correo.co'
    },
    status: 'authenticated',
    idToken: 'ABC',
    refreshToken: '123'
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  
  it('Debe de mostrar el componente correctamente', () => {
    const wrapper = shallowMount(NavbarComponent, {
      global: {
        plugins: [ store ]
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })


  it('Click en el logout, debe de cerrar sesión y redireccionar', async () => {
    const wrapper = shallowMount(NavbarComponent, {
      global: {
        plugins: [ store ]
      }
    })

    await wrapper.find('button').trigger('click')

    expect(mockRouter.push).toHaveBeenCalledTimes(1)
    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login' })
    expect(store.state.auth).toEqual({
      user: null,
      status: 'not-authenticated',
      idToken: null,
      refreshToken: null
    })
  })
})