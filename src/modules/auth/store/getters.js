/**
 * Traer información del state que se puede traer del state,
 * Es parecido a las computed properties
 */
 export const currentState = ( state ) => {
  return state.status
}

export const username = ( state ) => {
  return state.user?.name || ''
}