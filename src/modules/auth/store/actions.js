/**
 * Son acciones que pueden ser asincronas que puede llamar una mutación
 */
import authAPI from "@/api/authApi";


export async function createUser({ commit }, user) {
  const { name, email, password } = user

  try {
    const { data } = await authAPI.post(':signUp', { email, password, returnSecureToken: true })
    const { idToken, refreshToken } = data

    await authAPI.post(':update', { displayName: name, idToken })

    delete user.password
    commit('loginUser', { user, idToken, refreshToken })

    return { ok: true }
  } catch (error) {
    return { ok: false, message: error.response.data.error.message }
  }
}

export async function signInUser({ commit }, user) {
  const { email, password } = user

  try {
    const { data } = await authAPI.post(':signInWithPassword', { email, password, returnSecureToken: true })
    const { idToken, refreshToken, displayName } = data

    user.name = displayName
    commit('loginUser', { user, idToken, refreshToken })
    
    return { ok: true }
  } catch (error) {
    return { ok: false, message: error.response.data.error.message }
  }
}

export async function checkAuthentication({ commit }) {
  const idToken = localStorage.getItem('idToken')
  const refreshToken = localStorage.getItem('refreshToken')

  if ( !idToken ) {
    commit('logout')
    return { ok: false, message: 'No hay token' }
  }

  try {
    const { data } = await authAPI.post(':lookup', { idToken })
    const { displayName, email } = data.users[0]

    const user = {
      name: displayName,
      email
    }

    commit('loginUser', { user, idToken, refreshToken })
    return { ok: true }
  } catch (error) {
    commit('logout')
    return { ok: false, message: error.response.data.error.message }
  }
}
