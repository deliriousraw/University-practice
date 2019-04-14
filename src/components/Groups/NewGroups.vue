<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm6 offset-sm3>
        <h1 class="text--secondary mb-3">Добавить Новую Группу</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field name="alias"
                        label="Алиас группы"
                        type="text"
                        required
                        :rules="[v => !!v || 'Алиас групппы обязателен']"
                        v-model="alias">
          </v-text-field>
          <v-text-field name="name"
                        label="Полное название группы"
                        type="text"
                        v-model="name">
          </v-text-field>
          <v-select :items="faculties"
                    v-model="facultyId"
                    label="Факультет">
          </v-select>
        </v-form>
        <v-btn :disabled="!valid"
                class="success mb-3"
                @click="createGroup">
              Добавить группу
        </v-btn>
        <v-layout row>
          <v-flex xs12>
              <v-select :items="faculties"
                        v-model="filterFacultyId"
                        label="Отфильтровать по факультету">
              </v-select>
            <v-list>
              <v-list-tile
                v-for="(item, index) in groups"
                :key="`group-${index}`">

                <v-list-tile-action>
                  <v-icon color="green">star</v-icon>
                </v-list-tile-action>

                <v-list-tile-content>
                  <v-list-tile-title v-text="`Группа ${item.alias}`"></v-list-tile-title>
                  <v-list-tile-sub-title v-html="item.name"></v-list-tile-sub-title>
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
      alias: '',
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
    groups () {
      return this.filterFacultyId ? this.$store.getters.groups.filter(group => group.facultyId === this.filterFacultyId) : this.$store.getters.groups
    }
  },
  methods: {
    createGroup () {
      if (this.$refs.form.validate()) {
        const department = {
          alias: this.alias,
          name: this.name,
          facultyId: this.facultyId
        }
        this.$store.dispatch('createGroup', department)
        this.clearFields()
      }
    },
    clearFields () {
      this.alias = ''
      this.name = ''
      this.facultyId = null
    }
  }
}
</script>
<style lang="scss" scoped
</style>
