/**
 * Traer información del state que se puede traer del state,
 * Es parecido a las computed properties
 */
 export const getEntriesByTerm = ( state ) => (term = '') => {
  if ( term === '' ) return state.entries

  return state.entries.filter( entry => entry.text.toLowerCase().includes( term.toLowerCase() ) )
}

export const getEntryById = ( state ) => (id) => {
  return { ...state.entries.find((entry) => entry.id === id) }
}