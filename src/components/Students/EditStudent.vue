<template>
  <v-dialog width="800px" v-model="dialog">
    <v-btn color="primary" slot="activator">Редактировать</v-btn>
    <v-card>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-card-title>
              <h2 class="text-primary">Редактировать: {{fio}}</h2>
            </v-card-title>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-card-text>
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
            </v-card-text>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn outline
                     class="success mb-3"
                     @click="onCancel()">
                Отменить
              </v-btn>
              <v-btn class="success mb-3"
                     @click="onSave()">
                Сохранить
              </v-btn>
            </v-card-actions>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'EditStudent',
  props: {
    student: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      fio: this.student.fio,
      facultyID: this.student.facultyID,
      groupID: this.student.groupID,
      specialtyID: this.student.specialtyID,
      groupCourse: this.student.groupCourse,
      groupNumber: this.student.groupNumber,
      groupTeh: this.student.groupTeh,
      level: this.student.level,
      studyForm: this.student.studyForm,
      financing: this.student.financing,
      startDate: this.student.startDate,
      startDateMenu: false
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
    onCancel () {
      this.dialog = false
      this.fio = this.student.fio
      this.facultyID = this.student.facultyID
      this.groupID = this.student.groupID
      this.specialtyID = this.student.specialtyID
      this.groupCourse = this.student.groupCourse
      this.groupNumber = this.student.groupNumber
      this.groupTeh = this.student.groupTeh
      this.level = this.student.level
      this.studyForm = this.student.studyForm
      this.financing = this.student.financing
      this.startDate = this.student.startDate
    },
    onSave () {
      const student = {
        id: this.student.id,
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
      this.$store.dispatch('updateStudent', student)
      this.dialog = false
    }
  }
}
</script>

