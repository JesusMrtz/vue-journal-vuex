/**
 * Son acciones que pueden ser asincronas que puede llamar una mutación
 */
import journalAPI from "@/api/journalApi";


export async function loadEntries({ commit }) {
  try {
    const { data } = await journalAPI.get('/entries.json')
    const entries = []
  
    if ( !data ) commit('setEntries', [])
    
    for( let id of Object.keys(data) ) {
      entries.push({
        id,
        ...data[id]
      })
    }

    commit('setEntries', entries)
  } catch (error) {
    console.log(error)
  }
}

export async function updateEntry({ commit }, entry) {
  try {
    const { id, text, date, picture } = entry
    await journalAPI.put(`/entries/${id}.json`, ({ text, date, picture }))
   
    commit('updateEntry', {
      id,
      text,
      date,
      picture
    })
  } catch (error) {
    console.log(error)
  }
}

export async function createEntry({ commit }, entry) {
  try {
    const { data: { name } } = await journalAPI.post(`/entries.json`, entry)
    
    entry.id = name
    commit('addEntry', entry)

    return name;
  } catch (error) {
    console.log(error)
  }
}

export async function deleteEntry({ commit }, id) {
  try {
    await journalAPI.delete(`/entries/${id}.json`)
    commit('deleteEntry', id)
  } catch (error) {
    console.log(error)
  }
}