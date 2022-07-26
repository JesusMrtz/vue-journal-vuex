import { shallowMount } from "@vue/test-utils"
import Swal from "sweetalert2"
import LoginView from '@/modules/auth/views/LoginView'
import createVuexStore from "../../../mocks/mock-store"


/** Crear mock de vue-router para compositionAPI*/
const mockRouter = {
  push: jest.fn()
}

jest.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))


/** Crear mock del sweetalert  */
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn()
}))

describe('Pruebas en el LoginView', () => {
  const store = createVuexStore({
    status: 'not-authenticated',
    user: null,
    idToken: null,
    refreshToken: null
  })

  store.dispatch = jest.fn()

  beforeEach( () => jest.clearAllMocks() )
  
  it('Debe de hacer match con el snapshot', () => {
    const wrapper = shallowMount(LoginView, {
      global: {
        plugins: [ store ],
        stubs: ['router-link']
      }
    })

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('Credenciales incorrectas, dispara el error del Sweetalert', async() => {
    store.dispatch.mockReturnValueOnce({ ok: false, message: 'Error en credenciales' })

    const wrapper = shallowMount(LoginView, {
      global: {
        plugins: [ store ],
        stubs: ['router-link']
      }
    })

    await wrapper.find('form').trigger('submit')

    expect(store.dispatch).toHaveBeenCalledWith("auth/signInUser", {"email": "", "password": ""})
    expect(Swal.fire).toHaveBeenCalledWith("Error", "Error en credenciales", "error")
  })

  it('Debe de redirigir a la ruta no-entry', async() => {
    store.dispatch.mockReturnValueOnce({ ok: true })

    const wrapper = shallowMount(LoginView, {
      global: {
        plugins: [ store ],
        stubs: ['router-link']
      }
    })

    const [ txtEmail, txtPassword ] = wrapper.findAll('input')
    await txtEmail.setValue('test@test.com')
    await txtPassword.setValue('12334455')

    await wrapper.find('form').trigger('submit')

    expect(store.dispatch).toHaveBeenCalledWith("auth/signInUser", {"email": "test@test.com", "password": "12334455"})
    expect(mockRouter.push).toHaveBeenCalledWith({"name": "no-entry"})
  })
})