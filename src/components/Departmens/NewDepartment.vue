<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Добавить Новую Кафедру</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field name="name"
                        label="Название Кафедры"
                        type="text"
                        required
                        :rules="[v => !!v || 'Название Кафедры обязательно']"
                        v-model="name">
          </v-text-field>
          <v-text-field name="chief"
                        label="Заведующий кафедры"
                        type="text"
                        required
                        :rules="[v => !!v || 'Имя Заведующего Кафедры обязательно']"
                        v-model="chief">
          </v-text-field>
          <v-select :items="faculties"
                    v-model="facultyId"
                    label="Кафедра">
          </v-select>
        </v-form>
        <v-btn :disabled="!valid"
                class="success mb-3"
                @click="createDepartment">
              Добавить кафедру
        </v-btn>
        <v-layout row>
          <v-flex xs12>
            <v-list>
              <v-list-tile
                v-for="(item, index) in departments"
                :key="`faculty-${index}`">

                <v-list-tile-action>
                  <v-icon color="green">star</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="`Кафедра ${item.name}`"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.chief"></v-list-tile-sub-title>
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
      chief: '',
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
    departments () {
      return this.$store.getters.departments
    }
  },
  methods: {
    createDepartment () {
      if (this.$refs.form.validate()) {
        const department = {
          name: this.name,
          chief: this.chief,
          facultyId: this.facultyId
        }
        this.$store.dispatch('createDepartment', department)
        this.clearFields()
      }
    },
    clearFields () {
      this.name = ''
      this.chief = ''
      this.facultyId = null
    }
  }
}
</script>
<style lang="scss" scoped
</style>
