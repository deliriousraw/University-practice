<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Добавить Новый Факультет</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field name="name"
                        label="name"
                        type="text"
                        required
                        :rules="[v => !!v || 'Название факультета обязательно']"
                        v-model="name">
          </v-text-field>
        </v-form>
         <v-btn :disabled="!valid"
                  class="success mb-3"
                  @click="createFaculty">
              Добавить факультет
            </v-btn>
        <v-layout row>
          <v-flex xs12>
            <v-list>
              <v-list-tile
                v-for="(item, index) in faculties"
                :key="`faculty-${index}`">

                <v-list-tile-action>
                  <v-icon color="green">star</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="item.name"></v-list-tile-title>
                </v-list-tile-content>

              </v-list-tile>
            </v-list>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      name: '',
      valid: false
    }
  },
  computed: {
    faculties () {
      return this.$store.getters.faculties
    }
  },
  methods: {
    createFaculty () {
      if (this.$refs.form.validate()) {
        this.$store.dispatch('createFaculty', {name: this.name})
      }
    }
  }
}
</script>
<style lang="scss" scoped
</style>
