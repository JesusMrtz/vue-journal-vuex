import store from "@/store"

const isAuthenticatedGuard = async ( to, from, next ) => {
  const response =  await store.dispatch('auth/checkAuthentication')

  // Cuando inicio sesión me envia un undefined y no se porqué, pero cuando no estoy logueado me manda un ok : false
  if ( response === undefined ) next()
  else next({ name: 'login' })
}


export default isAuthenticatedGuard