<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>Новый Приказ</h1>
          <v-select :items="faculties"
                    v-model="facultyID"
                    label="Факультет">
          </v-select>
          <v-layout row>
            <v-flex xs6 class="mr-5">
              <v-select v-if="facultyID !== null"
                        :items="departments"
                        v-model="departmentID"
                        label="Кафедра">
              </v-select>
            </v-flex>
            <v-flex xs6>
              <v-select v-if="facultyID !== null"
                        :items="groups"
                        v-model="groupID"
                        label="Группа">
              </v-select>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs4 class="mr-5">
              <v-text-field v-if="groupID !== null"
                            name="groupCourse"
                            label="Курс группы"
                            type="number"
                            min="1"
                            max="6"
                            v-model="groupCourse">
              </v-text-field>
            </v-flex>
            <v-flex xs4 class="mr-5">
              <v-text-field v-if="groupID !== null"
                            name="groupNumber"
                            label="Номер группы"
                            type="number"
                            min="1"
                            max="10"
                            v-model="groupNumber">
              </v-text-field>
            </v-flex>
            <v-flex xs4 class="mr-5">
              <v-switch v-if="groupID !== null"
                        :label="`Техникум`"
                        v-model="groupTeh">
              </v-switch>
            </v-flex>
          </v-layout>
          <v-layout row>
            <v-flex xs6 class="mr-5">
              <v-menu ref="menu"
                      :close-on-content-click="false"
                      v-model="startDateMenu"
                      :nudge-right="40"
                      :return-value.sync="date"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px">
                <v-text-field slot="activator"
                              v-model="startDate"
                              label="Дата початку практики"
                              prepend-icon="event"
                              readonly>
                </v-text-field>
                <v-date-picker v-model="startDate" no-title scrollable locale="ru-Ru">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="startDateMenu = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6>
              <v-menu ref="menu2"
                      :close-on-content-click="false"
                      v-model="finishDateMenu"
                      :nudge-right="40"
                      :return-value.sync="date"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px">
                <v-text-field slot="activator"
                              v-model="finishDate"
                              label="Дата закінчення практики"
                              prepend-icon="event"
                              readonly>
                </v-text-field>
                <v-date-picker v-model="finishDate" no-title scrollable locale="ru-Ru">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="finishDate = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu2.save(date)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-btn :disabled="!facultyID"
                  class="success mb-3"
                  @click="createApplication">
              Создать «Наказ»
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      facultyID: null,
      departmentID: null,
      groupID: null,
      groupCourse: '',
      groupNumber: '',
      groupTeh: false,
      startDate: '',
      finishDate: '',
      startDateMenu: false,
      finishDateMenu: false
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
    },
    groups () {
      const filteredGroups = this.$store.getters.groups.filter((group) => {
        return group.facultyId === this.facultyID
      })
      return filteredGroups.map(department => {
        return {
          text: department.alias,
          value: department.id
        }
      })
    },
    magister () {
      return this.groupCourse > 4
    }
  },
  methods: {
    createApplication () {

    }
  }
}
</script>
<style lang="scss" scoped
</style>
