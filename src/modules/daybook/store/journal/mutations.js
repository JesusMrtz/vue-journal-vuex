/**
 * Son métodos sincronos que modifican el state
 */

export function setEntries(state, entries) {
  state.entries = [...state.entries, ...entries]
  state.isLoading = false
}

export function updateEntry(state, entry) {
  const idx = state.entries.findIndex(({ id }) => entry.id === id);
  state.entries[idx] = entry;
}

export function addEntry(state, entry) {
  state.entries.unshift(entry)
}

export function deleteEntry(state, id) {
  const deleteEntryById = state.entries.filter(entry => entry.id !== id)
  state.entries = deleteEntryById
}