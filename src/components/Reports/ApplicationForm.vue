<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>Новый Приказ</h1>
          <v-select :items="faculties"
                    v-model="facultyID"
                    label="Факультет">
          </v-select>
          <v-select v-if="facultyID !== null"
                    :items="departments"
                    v-model="departmentID"
                    label="Кафедра">
          </v-select>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      facultyID: null,
      departmentID: null
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
      const filteredDepartments = this.$store.getters.departments.filter((department) => {
        return department.facultyId === this.facultyID
      })
      return filteredDepartments.map(department => {
        return {
          text: department.name,
          value: department.id
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped
</style>
