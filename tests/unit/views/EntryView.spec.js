import { shallowMount } from "@vue/test-utils"
import { createStore } from "vuex"
import Swal from "sweetalert2"
import { journalState } from "../mocks/test-journal-state"

import journal from '@/modules/daybook/store/journal'
import EntryView from '@/modules/daybook/views/EntryView'

const createVuexStorage = (initialState) => 
  createStore({
    modules: {
      journal: {
        ...journal,
        state: { ...initialState }
      }
    }
  })

jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  showLoading: jest.fn(),
  close: jest.fn()
}))


describe('Pruebas en el EntryView', () => {
  const store = createVuexStorage(journalState)
  // Mockeamos los dispatch de las acciones del store
  store.dispatch = jest.fn()
  // Mockeamos las mutations del store
  store.mutations = jest.fn()

  const mockRouter = {
    push: jest.fn()
  }

  let wrapper 

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallowMount(EntryView, {
      props: {
        id: '1'
      },
      global: {
        mocks: {
          $router: mockRouter
        },
        plugins: [ store ]
      }
    })
  })

  it('Debe de sacar al usuario porque el ID no existe', () => {
    const wrapper = shallowMount(EntryView, {
      props: {
        id: 'no-existe-id'
      },
      global: {
        mocks: {
          $router: mockRouter
        },
        plugins: [ store ]
      }
    })

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'no-entry' })
  })

  it ('Debe de mostrar la entrada correctamente', () => {
    expect(wrapper.html()).toMatchSnapshot()
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('Debe de borrar la entrada y salida', async () => {
    Swal.fire.mockReturnValueOnce(Promise.resolve({ isConfirmed: true }))

    await wrapper.find('.btn-danger').trigger('click')

    expect(Swal.fire).toHaveBeenCalledWith({
      title: '¿Está seguro?',
      text: 'Una vez eliminado, no se podrá recuperar',
      showDenyButton: true,
      confirmButtonText: 'Eliminar'
    })

    expect(mockRouter.push).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith('journal/deleteEntry', '1')
  })
})