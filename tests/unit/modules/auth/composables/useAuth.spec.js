import useAuth from "@/modules/auth/composables/useAuth";


const mockStore = {
  dispatch: jest.fn(),
  commit: jest.fn(),
  getters: {
    'auth/currentState': 'authenticated',
    'auth/username': 'Jesús'
  }

}

/** mock completo de la librería vuex */
jest.mock( 'vuex', () => ({
  useStore: () => mockStore
}))

describe('Pruebas en useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })


  it('createUser exitoso', async () => {
    const { createUser }  = useAuth()

    const newUser = { name: 'Jesus', email: 'correo@correo.com' }

    // Le damos un retorno para el response cuando llame el méotdo useStore
    mockStore.dispatch.mockReturnValue({ ok: true })
    const response = await createUser(newUser)

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", {"email": "correo@correo.com", "name": "Jesus"})
    expect(response).toEqual({ ok: true })
  })
  

  it ('CreateUser Fallido, porque el usuario ya existe', async() => {
    const { createUser }  = useAuth()

    const newUser = { name: 'Jesus', email: 'correo@correo.com' }

    // Le damos un retorno para el response cuando llame el méotdo useStore
    mockStore.dispatch.mockReturnValue({ ok: false, message: 'EMAIL_EXISTS' })
    const response = await createUser(newUser)

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/createUser", {"email": "correo@correo.com", "name": "Jesus"})
    expect(response).toEqual({ ok: false, message: 'EMAIL_EXISTS' })
  })


  it ('Login exitoso', async() => {
    const { signInUser }  = useAuth()

    const loginForm = { email: 'correo@correo.com', password: '123456' }

    // Le damos un retorno para el response cuando llame el méotdo useStore
    mockStore.dispatch.mockReturnValue({ ok: true,})
    const response = await signInUser(loginForm)

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/signInUser", loginForm)
    expect(response).toEqual({ ok: true})
  })


  it ('Login Falló', async() => {
    const { signInUser }  = useAuth()

    const loginForm = { email: 'correo@correo.com', password: '123456' }

    // Le damos un retorno para el response cuando llame el méotdo useStore
    mockStore.dispatch.mockReturnValue({ ok: false,})
    const response = await signInUser(loginForm)

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/signInUser", loginForm)
    expect(response).toEqual({ ok: false})
  })

  
  it ('checkAuthStatus', async() => {
    const { checkAuthStatus }  = useAuth()
    // Le damos un retorno para el response cuando llame el méotdo useStore
    mockStore.dispatch.mockReturnValue({ ok: true,})
    const response = await checkAuthStatus()

    expect(mockStore.dispatch).toHaveBeenCalledWith("auth/checkAuthentication")
    expect(response).toEqual({ ok: true})
  })

  it ('logout', async() => {
    const { logout }  = useAuth()
    const response = await logout()

    expect(mockStore.commit).toHaveBeenCalledWith("auth/logout")
    expect(mockStore.commit).toHaveBeenCalledWith("journal/clearEntries")
    expect(response).toBeUndefined()
  })

  it ('Computed: authSate, username', async() => {
    const { authStatus, username } = useAuth()

    expect(authStatus.value).toBe('authenticated')
    expect(username.value).toBe('Jesús')
  })
})