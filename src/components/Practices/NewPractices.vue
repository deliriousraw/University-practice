<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Добавить Новую Практику</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field name="name"
                        label="Название Практики"
                        type="text"
                        required
                        :rules="[v => !!v || 'Название Практики обязательно']"
                        v-model="name">
          </v-text-field>
          <v-select :items="faculties"
                    v-model="facultyId"
                    label="Факультет">
          </v-select>
        </v-form>
        <v-btn :disabled="!valid"
                class="success mb-3"
                @click="createPractice">
              Добавить Практику
        </v-btn>
        <v-layout row>
          <v-flex xs12>
            <v-list>
              <v-list-tile
                v-for="(item, index) in practices"
                :key="`practise-${index}`">

                <v-list-tile-action>
                  <v-icon color="green">star</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="`${item.name}`"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="getFacultyName(item.facultyId)"></v-list-tile-sub-title>
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
      facultyId: null,
      valid: false
    }
  },
  computed: {
    faculties () {
      return this.$store.getters.faculties.map(faculty => {
        return {
          text: faculty.name,
          value: faculty.id
        }
      })
    },
    practices () {
      return this.$store.getters.practices
    }
  },
  methods: {
    createPractice () {
      if (this.$refs.form.validate()) {
        const practice = {
          name: this.name.trim(),
          facultyId: this.facultyId
        }
        this.$store.dispatch('createPractice', practice)
        this.clearFields()
      }
    },
    clearFields () {
      this.name = ''
      this.facultyId = null
    },
    getFacultyName (facultyID) {
      return this.$store.getters.getFacultiesById(facultyID).name
    }
  }
}
</script>
<style lang="scss" scoped
</style>
