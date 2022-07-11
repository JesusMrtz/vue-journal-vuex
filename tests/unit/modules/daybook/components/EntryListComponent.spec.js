import { createStore } from "vuex"
import { shallowMount } from "@vue/test-utils"
import { journalState } from "../../../mocks/test-journal-state"
import journal from '@/modules/daybook/store/journal'
import EntryListComponent from '@/modules/daybook/components/EntryListComponent'

const createVuexStore = (initialState) => 
createStore({
  modules: {
    journal: {
      ...journal,
      state: { ...initialState }
    }
  }
})

describe('Pruebas en el EntryList', () => {
  const mockRouter = {
    push: jest.fn()
  }
  const store = createVuexStore(journalState)
  let wrapper

  beforeEach(() => {
    jest.clearAllMocks()
    wrapper = shallowMount(EntryListComponent, {
      global: {
        mocks: {
          $router: mockRouter
        },
        plugins: [ store ]
      }
    })
  })

  it('Debe de llamar el getEntriesByTem sin términos y mostrar 2 entradas', async () => {
    expect(wrapper.findAll('entry-stub').length).toBe(2)
    expect(wrapper.html()).toMatchSnapshot()
  })

  it ('Debe llar el getEntriesByTerm y filtrar las entradas', async() => {
    const input = wrapper.find('input')
    await input.setValue('segunda')
    
    expect(wrapper.findAll('entry-stub').length).toBe(1)
  })

  it('El boton de "Nuevo" debe de redireccionar a /new', async() => {
    await wrapper.find('button').trigger('click')

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'entry', params: {id: 'new'} })
  })
})