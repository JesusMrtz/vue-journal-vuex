<template>
  <Navbar/>
  <div v-if="isLoading">
    <div class="col-3 alert-info text-center mt-5 mx-auto">
      Espere por favor...
      <h3 class="mt-2">
        <i class="fa fa-spin fa-sync"></i>
      </h3>
    </div>
  </div>
  <div class="d-flex" v-else>
    <div class="col-4">
      <EntryList />
    </div>
    <div class="col">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineAsyncComponent } from '@vue/runtime-core'
import { mapActions, mapState } from 'vuex'


export default {
  components: {
    Navbar: defineAsyncComponent(() => import('../components/NavbarComponent')),
    EntryList: defineAsyncComponent(() => import('../components/EntryListComponent'))
  },

  data() {
    return {}
  },

  computed: {
    ...mapState('journal', ['isLoading'])
  },

  created() {
    this.loadEntries();
  },

  methods: {
    ...mapActions('journal', ['loadEntries'])
  }
}
</script>

<style>

</style>