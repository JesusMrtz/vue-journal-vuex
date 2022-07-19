import { computed } from "vue"
import { useStore } from "vuex"


const useAuth = () => {
  const store = useStore()
  const createUser = async(user) => {
    const response = await store.dispatch('auth/createUser', user)
    return response
  }

  const signInUser = async (user) => {
    const response = await store.dispatch('auth/signInUser', user)
    return response
  }

  const checkAuthStatus = async () => {
    const response = await store.dispatch('auth/checkAuthentication')
    return response
  }

  const logout = () => {
    store.commit('auth/logout')
    store.commit('journal/clearEntries')
  }

  return {
    checkAuthStatus,
    createUser,
    logout,
    signInUser,

    authStatus: computed(() => store.getters['auth/currentState']),
    username: computed(() => store.getters['auth/username'])
  }
}


export default useAuth