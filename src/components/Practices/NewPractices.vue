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
          <v-select :items="faculties"
                    v-model="filterFacultyId"
                    label="Отфильтровать по факультету">
          </v-select>
        </v-form>
        <v-btn :disabled="!valid"
                class="success mb-3"
                @click="createPractice">
              Добавить Практику
        </v-btn>
        <!-- <v-btn class="success mb-3"
                @click="uniquePractices">
              Добавить все практики
        </v-btn> -->
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
      valid: false,
      filterFacultyId: null
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
      return this.filterFacultyId
        ? this.$store.getters.practices.filter(practice => practice.facultyId === this.filterFacultyId)
        : this.$store.getters.practices
    },
    allUniquePractices () {
      return [...new Set(this.$store.getters.practices.map(practice => practice.name))]
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
    uniquePractices () {
      this.allUniquePractices.forEach((item) => {
        const practice = {
          name: item,
          facultyId: this.facultyId
        }
        console.log(practice)
        // this.$store.dispatch('createPractice', practice)
      })
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
