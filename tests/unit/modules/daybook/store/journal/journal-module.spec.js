import { createStore } from "vuex";
import journal from '@/modules/daybook/store/journal'
import journalAPI from "@/api/journalApi";
import authAPI from "@/api/authApi";
import { journalState } from "../../../../mocks/test-journal-state";

/**
 * Enviar información para tener un estado inicial
 */

jest.mock('@/api/journalApi')
const createVuexStore = ( initialState ) => {
  return createStore({
    modules: {
      journal: {
        ...journal,
        state: structuredClone(initialState)
      }
    }
  })
}

describe('VUEX - Prueba en el Journal Module', () => {

  /** Antes de que una pruba se ejecute, se inicia sesión para obtener un idToken   */
  beforeAll( async () => {
    const { data } = await authAPI.post(':signInWithPassword', { email: 'correo2@correo.com', password: '123456', returnSecureToken: true })

    localStorage.setItem('idToken', data.idToken)
  })

  // Pruebas básicas
  it('Este es el estado inicial, debe de lucir este state', () => {
    const store = createVuexStore(journalState)
    const { isLoading, entries } = store.state.journal

    expect(isLoading).toBeFalsy()
    expect(entries.length).toBe(2)
  })


  // Mutations
  it('Mutations setEntries', () => {
    const store = createVuexStore({ isLoading: true, entries: [] })

    store.commit('journal/setEntries', journalState.entries)

    //console.log(store.state)

    expect(store.state.journal.entries.length).toBe(2)
    expect(store.state.journal.entries.isLoading).toBeFalsy()
  })

  it('Mutation updateEntry', () => {
    const store = createVuexStore(journalState)
    const entry = {
      id: '2',
      date: new Date().toString(),
      picture: null,
      text: 'prueba unitaria'
    }

    const entryID = store.state.journal.entries.findIndex(({ id }) => entry.id === id)

    store.commit('journal/updateEntry', entry)

    expect(store.state.journal.entries.length).toBe(2)
    expect(store.state.journal.entries[entryID]).toEqual(entry)
  })

  it ('Mutation addEntry', () => {
    const store = createVuexStore(journalState)
    const entry = {
      id: '3',
      date: new Date().toString(),
      picture: null,
      text: 'prueba  número 2'
    }

    store.commit('journal/addEntry', entry)

    expect(store.state.journal.entries.length).toBe(3)
    expect(store.state.journal.entries[0]).toEqual(entry)

  })

  it ('Mutation deleteEntry', () => {
    const store = createVuexStore(journalState)
    store.commit('journal/deleteEntry', '1')

    expect(store.state.journal.entries.length).toBe(1)
    expect(store.state.journal.entries.find(e => e.id === '2')).toBeUndefined()

  })


  // Getters
  it ('Getters : getEntriesByTerm getEntryById', () => {
    const store = createVuexStore(journalState)

    const [entry1, entry2] = journalState.entries

    expect(store.getters['journal/getEntriesByTerm']('').length).toBe(2)
    expect(store.getters['journal/getEntriesByTerm']('mundo').length).toBe(1)
    expect(store.getters['journal/getEntriesByTerm']('mundo')).toEqual([ entry1 ])

    expect(store.getters['journal/getEntryById']('-N68Xkr1grhuC7zXKH4j')).toEqual(entry2)
  })


  // Actions 
  it('Actions: loadEntries', async () => {
    const store = createVuexStore({ isLoading: true, entries: [] })

    await store.dispatch('journal/loadEntries')

    expect(store.state.journal.entries.length).toBe(0)
  })

  it('Actions: updateEntry', async () => {
    /**
     * Prueba Donde se toca los registros físicos en Firebase
     */
    // const store = createVuexStore(journalState)
    // const journalModule = store.state.journal

    // const updatedEntry = {
    //   id: '-N68Xkr1grhuC7zXKH4j',
    //   picture: 'https://res.cloudinary.com/dx0pryfzn/upload/sample.jpg',
    //   date: 1627077239523,
    //   text: 'Esta es la segunda entrada mock',
    //   otroCampo: true
    // }

    // await store.dispatch('journal/updateEntry', updatedEntry)

    // expect(store.state.journal.entries.length).toBe(2)
    // expect( journalModule.entries.find( e => e.id === updatedEntry.id ) ).toEqual({
    //   id: '-N68Xkr1grhuC7zXKH4j',
    //   picture: 'https://res.cloudinary.com/dx0pryfzn/upload/sample.jpg',
    //   date: 1627077239523,
    //   text: 'Esta es la segunda entrada mock',
    // })



    // Prueba simulando el mock de Firebase
    const mockStore = createVuexStore(journalState)
    const updatedEntry = {
      id: '-N68Xkr1grhuC7zXKH4j',
      picture: 'https://res.cloudinary.com/dx0pryfzn/upload/sample.jpg',
      date: 1627077239523,
      text: 'Esta es la segunda entrada mock',
      otroCampo: true
    }
 
    const spyOnPostMethod = jest.spyOn(journalAPI, 'put')
    const spyOnStoreCommit = jest.spyOn(mockStore, 'commit')
    
    const result = await mockStore.dispatch('journal/updateEntry', updatedEntry)
    
    // console.log(result)
    expect(spyOnPostMethod).toHaveBeenCalled()
    expect(spyOnStoreCommit).toHaveBeenCalled()
    // expect(result).toBe(updatedEntry.id)
    expect(mockStore.state.journal.entries.find((entry) => entry.id === updatedEntry.id)).toEqual( {
      id: '-N68Xkr1grhuC7zXKH4j',
      picture: 'https://res.cloudinary.com/dx0pryfzn/upload/sample.jpg',
      date: 1627077239523,
      text: 'Esta es la segunda entrada mock'
    })
  })

  it('Actions: createEntry', async () => {
    const mockStore = createVuexStore(journalState)
    const newEntry = { date: 1646585019497, text: 'new mock entry' }
    const newEntryId = 'newEntryId'
 
    const spyOnPostMethod = jest.spyOn(journalAPI, 'post').mockResolvedValue({ data: { name: newEntryId } })
    const spyOnStoreCommit = jest.spyOn(mockStore, 'commit')
    
    const result = await mockStore.dispatch('journal/createEntry', newEntry)
    
    expect(spyOnPostMethod).toHaveBeenCalled()
    expect(spyOnStoreCommit).toHaveBeenCalled()
    expect(result).toBe(newEntryId)
    expect(mockStore.state.journal.entries.find((entry) => entry.id === newEntryId)).toBeTruthy()
  })

  it('Action: deleteEntry', async () => {
    const store = createVuexStore(journalState)
    const journalModule = store.state.journal

    await store.dispatch('journal/deleteEntry', '-N6U_ArqF1Cmi6OR8vfM')

    console.log(journal.entries)

    expect(journalModule.entries.find(({id}) => id === '-N6U_ArqF1Cmi6OR8vfM')).toBeUndefined()
  })
})
