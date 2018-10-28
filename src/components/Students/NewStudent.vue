<template>
  <v-container>
    <v-layout row>
      <v-flex xs12 sm10 offset-sm1>
        <h1 class="text--secondary mb-3">Добавить Нового Студента</h1>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-text-field name="fio"
                        label="Ф.И.О"
                        type="text"
                        required
                        :rules="[v => !!v || 'ФИО студента обязательно']"
                        v-model="fio">
          </v-text-field>

          <v-layout row>
            <v-flex xs6 class="mr-5">
              <v-select :items="faculties"
                        v-model="facultyID"
                        label="Факультет">
              </v-select>
            </v-flex>
            <v-flex xs6>
              <v-select :items="specialties"
                        v-model="specialtyID"
                        label="Специальности">
              </v-select>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4 class="mr-5">
              <v-select :items="groups"
                        v-model="groupID"
                        label="Группа">
              </v-select>
            </v-flex>
            <v-flex xs3 class="mr-5">
              <v-text-field name="groupCourse"
                            label="Курс группы"
                            type="number"
                            min="1"
                            max="6"
                            v-model="groupCourse">
              </v-text-field>
            </v-flex>
            <v-flex xs3 class="mr-5">
              <v-text-field name="groupNumber"
                            label="Номер группы"
                            type="number"
                            min="1"
                            max="10"
                            v-model="groupNumber">
              </v-text-field>
            </v-flex>

            <v-flex xs2>
              <v-switch :label="`Техникум`"
                        v-model="groupTeh">
              </v-switch>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs4 class="mr-5">
              <v-select :items="levels"
                        v-model="level"
                        label="Степень обучения">
              </v-select>
            </v-flex>
            <v-flex xs4 class="mr-5">
              <v-select :items="studyForms"
                        v-model="studyForm"
                        label="Форма обучения">
              </v-select>
            </v-flex>
            <v-flex xs4>
              <v-select :items="financings"
                        v-model="financing"
                        label="Форма замовлення">
              </v-select>
            </v-flex>
          </v-layout>

          <v-menu ref="menu2"
                      :close-on-content-click="false"
                      v-model="startDateMenu"
                      :nudge-right="40"
                      :return-value.sync="startDate"
                      lazy
                      transition="scale-transition"
                      offset-y
                      full-width
                      min-width="290px">
                <v-text-field slot="activator"
                              v-model="startDate"
                              label="Дата початку навчання"
                              prepend-icon="event"
                              readonly>
                </v-text-field>
                <v-date-picker v-model="startDate" no-title scrollable locale="ru-Ru">
                  <v-spacer></v-spacer>
                  <v-btn flat color="primary" @click="startDate = false">Cancel</v-btn>
                  <v-btn flat color="primary" @click="$refs.menu2.save(startDate)">OK</v-btn>
                </v-date-picker>
            </v-menu>

        </v-form>
         <v-btn :disabled="!valid"
                class="success mb-3"
                @click="createStudent">
              Добавить студента
        </v-btn>
        <!-- <v-layout row>
          <v-flex xs12>
            <v-card>
              <v-card-title>
                Студенты
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Знайти студента"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="desserts"
                :search="search">

                <template slot="items" slot-scope="props">
                  <td>{{ props.item.name }}</td>
                  <td class="text-xs-right">{{ props.item.calories }}</td>
                  <td class="text-xs-right">{{ props.item.fat }}</td>
                  <td class="text-xs-right">{{ props.item.carbs }}</td>
                  <td class="text-xs-right">{{ props.item.protein }}</td>
                  <td class="text-xs-right">{{ props.item.iron }}</td>
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>
              </v-data-table>
            </v-card>
          </v-flex>
        </v-layout> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      fio: '',
      facultyID: null,
      groupID: null,
      specialtyID: null,
      groupCourse: '',
      groupNumber: '',
      groupTeh: false,
      level: 'Бакалавр',
      studyForm: 'Денна',
      financing: 'Бюджет',
      startDate: '',
      startDateMenu: false,
      valid: false
    }
  },
  computed: {
    students () {
      return this.$store.getters.students.map(student => {
        return {
          id: student.id,
          fio: student.name,
          facultyID: student.facultyID,
          groupID: student.groupID,
          specialtyID: student.specialtyID,
          groupCourse: student.groupCourse,
          groupNumber: student.groupNumber,
          groupTeh: student.groupTeh,
          level: student.level,
          studyForm: student.studyForm,
          financing: student.financing,
          startDate: student.startDate
        }
      })
    },
    faculties () {
      return this.$store.getters.faculties.map(faculty => {
        return {
          text: faculty.name,
          value: faculty.id
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
    specialties () {
      return this.$store.getters.specialties.map(specialty => {
        return {
          text: `${specialty.code} ${specialty.name}`,
          value: specialty.id
        }
      })
    },
    levels () {
      return [
        {
          text: 'Бакалавр',
          value: 'Бакалавр'
        },
        {
          text: 'Магістр',
          value: 'Магістр'
        }
      ]
    },
    studyForms () {
      return [
        {
          text: 'Денна',
          value: 'Денна'
        },
        {
          text: 'Заочна',
          value: 'Заочна'
        }
      ]
    },
    financings () {
      return [
        {
          text: 'Бюджет',
          value: 'Бюджет'
        },
        {
          text: 'Контракт',
          value: 'Контракт'
        }
      ]
    }
  },
  methods: {
    createStudent () {
      if (this.$refs.form.validate()) {
        const student = {
          fio: this.fio,
          facultyID: this.facultyID,
          groupID: this.groupID,
          specialtyID: this.specialtyID,
          groupCourse: this.groupCourse,
          groupNumber: this.groupNumber,
          groupTeh: this.groupTeh,
          level: this.level,
          studyForm: this.studyForm,
          financing: this.financing,
          startDate: this.startDate
        }
        this.$store.dispatch('createStudent', student)
        this.clearFields()
      }
    },
    clearFields () {
      this.fio = ''
      this.facultyID = null
      this.groupID = null
      this.specialtyID = null
      this.groupCourse = ''
      this.groupNumber = ''
      this.groupTeh = false
      this.level = 'Бакалавр'
      this.studyForm = 'Денна'
      this.financing = 'Бюджет'
      this.startDate = ''
      this.startDateMenu = false
    }
  }
}
</script>
<style lang="scss" scoped
</style>
