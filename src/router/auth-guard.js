import store from "@/store"

const isAuthenticatedGuard = async ( to, from, next ) => {
  const response =  await store.dispatch('auth/checkAuthentication')

  // console.log(response)
  // next()
  // return

  if ( response === undefined ) next()
  else next({ name: 'login' })
}


export default isAuthenticatedGuard