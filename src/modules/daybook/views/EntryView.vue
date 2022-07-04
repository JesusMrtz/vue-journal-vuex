<template>
  <div class="entry-title d-flex justify-content-between p-2">
    <div>
      <span class="text-success fs-3 fw-bold">{{ day }}</span>
      <span class="mx-1 fs-3">{{ month }}</span>
      <span class="mx-2 fs-4 fw-light">{{ yearDay }}</span>
    </div>
    <div>
      <input type="file" @change="onSelectedImage" accept="image/png, image/jpg, image/jpeg" ref="imageSelector" v-show="false">
      <button class="btn btn-danger mx-2"  v-if="entry.id" @click="onDeleteEntry">
        Borrar
        <i class="fa fa-trash-alt"></i>
      </button>
      <button class="btn btn-primary" @click="getRefSelectedImage">
        Subir foto
        <i class="fa fa-upload"></i>
      </button>
    </div>
  </div>
  <p>
  </p>
  <hr>
  <div class="d-flex flex-colum px-3 h-75">
    <textarea placeholder="¿Qué sucedió hoy?" v-model.trim="entry.text"></textarea>
  </div>
  <Fab icon="fa-save" @click="saveEntry"/>
  <img class="img-thumbnail" :src="entry.picture" alt="Picture" v-if="entry.picture && !localImage">
  <img class="img-thumbnail" :src="localImage" alt="Picture" v-if="localImage">
</template>

<script>
import Swal from 'sweetalert2'
import { defineAsyncComponent } from '@vue/runtime-core'
import { mapActions, mapGetters } from 'vuex'

import getDayMonthYear from '../helpers/getDayMonthYear'
import uploadImage from '../helpers/uploadImage'


export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },

  components: {
    Fab: defineAsyncComponent(() => import('../components/FabComponent'))
  },

  data() {
    return {
      entry: null,
      localImage: null,
      file: null
    }
  },

  computed: {
    ...mapGetters('journal', ['getEntryById']),
    getEntry() {
       return this.getEntryById(this.id)
    },

    day() {
      const { day } = getDayMonthYear(this.entry.date)
      return day
    },

    month() {
      const { month } = getDayMonthYear(this.entry.date)
      return month
    },

    yearDay() {
      const { yearDay } = getDayMonthYear(this.entry.date)
      return yearDay
    }
  },

  created() {
    this.searchEntryById()
  },

  watch: {
    id() {
      this.searchEntryById()
    }
  },

  methods: {
    ...mapActions('journal', ['updateEntry', 'createEntry', 'deleteEntry']),

    searchEntryById() {
      let entry = this.getEntry

      if ( this.id === 'new' ) {
        this.entry = {
          text: '',
          date: new Date().getTime()
        }
      } else {
        if ( !Object.keys(entry).length ) this.$router.push({ name: 'no-entry' })
        this.entry = entry
      }


    },

    async saveEntry() {
      new Swal({
        title: 'Espera por favor',
        allowOutsideClick: false
      })
      Swal.showLoading()

      const picture = await uploadImage(this.file)
      this.entry.picture = picture

      if ( this.entry.id ) {
        await this.updateEntry(this.entry)
      } else {
        const id = await this.createEntry(this.entry)
        this.$router.push({ name: 'entry', params: { id } })
      }

      this.file = null
      Swal.fire('Guardado', 'Entrada registrada con éxito', 'success')
    },

    async onDeleteEntry() {
      const { isConfirmed } = await Swal.fire({
        title: '¿Está seguro?',
        text: 'Una vez eliminado, no se podrá recuperar',
        showDenyButton: true,
        confirmButtonText: 'Eliminar'
      })

      if ( isConfirmed ) {
        new Swal ({
          title: 'Espere por favor',
          allowOutsideClick: false
        })
        Swal.showLoading()

        await this.deleteEntry(this.entry.id)
        this.$router.push({ name: 'no-entry' })

        Swal.fire('Eliminado', '', 'success')
      }
    },

    onSelectedImage(event) {
      const file = event.target.files[0]

      if ( !file ) {
        this.localImage = null
        this.file = null
        return
      }

      this.file = file

      const fr = new FileReader()
      fr.readAsDataURL(file)
      fr.onload = () => this.localImage = fr.result
    },

    getRefSelectedImage() {
      this.$refs.imageSelector.click()
    }
  }
}
</script>

<style lang="scss" scoped>
textarea {
  font-size: 20px;
  width: 100%;
  border: none;

  &:focus {
    outline: none;
  }
}

img {
  width: 200px;
  position: fixed;
  bottom: 150px;
  right: 20px;
  box-shadow: 0 5px 10px rgba(#000, .2);
}
</style>