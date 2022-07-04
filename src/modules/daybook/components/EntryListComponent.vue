<template>
  <div class="entry-list-container">
    <div class="px-2 pt-2">
      <input class="form-control" type="text" placeholder="Buscar entrada" v-model.trim="term">
    </div>
    <div class="mt-2 d-grid gap-2">
      <button type="button" class="btn btn-primary mx-3" @click="this.$router.push({ name: 'entry', params: { id: 'new' } })">
        <i class="fa fa-plus-circle"></i>
        Nueva entrada
      </button>
    </div>
    <div class="entry-scrollarea">
      <Entry v-for="entry in entriesByTerm" :key="entry.id" :entry="entry" />
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from '@vue/runtime-core'
import { mapGetters } from 'vuex'


export default {
  components: {
    Entry: defineAsyncComponent(() => import('./EntryComponent'))
  },

  data() {
    return {
      term: ''
    }
  },

  computed: {
    ...mapGetters('journal', ['getEntriesByTerm']),
    entriesByTerm() {
      return this.getEntriesByTerm(this.term)
    }
  }
}
</script>

<style lang="scss" scoped>
.entry-list-container {
  border-right: 1px solid #2c3e50;
  height: calc(100vh - 56px);
}

.entry-scrollarea {
  height: calc(100vh - 115px);
  overflow-y: scroll;
}
</style>