import axios from "axios"
import createVuexStore from "../../../mocks/mock-store"


describe('VUEX - Pruebas en el auth-module', () => {
  it ('Estado inicial', () => {
    const store = createVuexStore({
      status: 'authenticating',
      user: null,
      idToken: null,
      refreshToken: null
    })

    const { status, user, idToken, refreshToken } = store.state.auth

    expect(status).toBe('authenticating')
    expect(user).toBe(null)
    expect(idToken).toBe(null)
    expect(refreshToken).toBe(null)
  })


  /**  MUTATIONS */

  it('Mutations: loginUser', () => {
    const store = createVuexStore({
      status: 'authenticating',
      user: null,
      idToken: null,
      refreshToken: null
    })

    const payload = {
      user: { name: 'Jesús', email: 'correo3@gmail.com' },
      idToken: 'ABC-123',
      refreshToken: 'XYZ-123'
    }

    store.commit('auth/loginUser', payload)

    const { status, user, idToken, refreshToken } = store.state.auth

    expect(status).toBe('authenticated')
    expect(user).toEqual(payload.user)
    expect(idToken).toBe(payload.idToken)
    expect(refreshToken).toBe(payload.refreshToken)
  })

  it ('Mutations: logout', () => {
    const store = createVuexStore({
      status: 'authenticating',
      user: null,
      idToken: null,
      refreshToken: null
    })

    store.commit('auth/logout')

    const { status, user, idToken, refreshToken } = store.state.auth
    
    
    expect(status).toBe('not-authenticated')
    expect(user).toEqual(null)
    expect(idToken).toBe(null)
    expect(refreshToken).toBe(null)
    expect(localStorage.getItem('idToken')).toBeNull()
    expect(localStorage.getItem('refreshToken')).toBeNull()
  })


  /**  GETTERS */

  it('GETTERS - username y currentState', () => {
    const store = createVuexStore({
      status: 'authenticated',
      user: { name: 'Fernando', email: 'correo3@correo.com' },
      idToken: null,
      refreshToken: null
    })

    expect(store.getters['auth/currentState']).toBe('authenticated')
    expect(store.getters['auth/username']).toBe('Fernando')
  })


  /** ACTIONS */

  it('ACTIONS - createUser - Error usuario ya existe', async () => {
    const store = createVuexStore({
      status: 'not-authenticated',
      user: null,
      idToken: null,
      refreshToken: null
    })

    const newUser = {
      name: 'Test user',
      email: 'correo2@correo.com',
      password: '123456'
    }

    const response = await store.dispatch('auth/createUser', newUser)

    expect(response).toEqual({ ok: false, message: 'EMAIL_EXISTS' })
  })

  it('ACTIONS - createUser signInUser - Crea el usuario', async() => {
    const store = createVuexStore({
      status: 'not-authenticated',
      user: null,
      idToken: null,
      refreshToken: null
    })

    const newUser = { name: 'Test User', email: 'test@correo.com', password: '123456' }

    // signIn
    await store.dispatch('auth/signInUser', newUser)
    const { idToken } = store.state.auth

    // Borrar el usuario
    await axios.post(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=AIzaSyD9CoH_g8um9S2XmH_D3gpR43-c3EaUUWw`, {
      idToken
    })

    // Crear el usuario
    const response = await store.dispatch('auth/createUser', newUser)
    expect(response).toEqual({ ok: true })


    let { status, user, idToken: token, refreshToken } = store.state.auth
    
    expect(status).toBe('authenticated')
    expect(user).toMatchObject({ name: 'Test User', email: 'test@correo.com' })
    expect(typeof token).toBe('string')
    expect(typeof refreshToken).toBe('string')
  })


  it('ACTIONS: checkAuthentication - POSITIVA', async() => {
    const store = createVuexStore({
      status: 'not-authenticated',
      user: null,
      idToken: null,
      refreshToken: null
    })

    // SignIn
    await store.dispatch('auth/signInUser', { email: 'correo2@correo.com', password: '123456' })

    const { idToken } = store.state.auth

    localStorage.setItem('idToken', idToken)

    const checkResponse = await store.dispatch('auth/checkAuthentication')

    expect(checkResponse).toEqual({ ok: true })
    
    let { status, user, idToken: token, refreshToken } = store.state.auth
    
    expect(status).toBe('authenticated')
    expect(user).toMatchObject({ name: 'Karely Ricalde', email: 'correo2@correo.com' })
    expect(typeof token).toBe('string')
    expect(typeof refreshToken).toBe('string')
  })

  it('ACTIONS - checkAuthentication - NEGATIVA', async () => {
    const store = createVuexStore({
      status: 'not-authenticated',
      user: null,
      idToken: null,
      refreshToken: null
    })

    localStorage.clear()

    const checkResponse1 = await store.dispatch('auth/checkAuthentication')

    expect(checkResponse1).toEqual({ ok: false, message: 'No hay token' })
    expect(store.state.auth.status).toBe('not-authenticated')
  })
})