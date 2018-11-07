<template>
  <v-container>
    <v-layout row>
      <v-flex xs12>
        <h1>Новый Отчёт</h1>
          <v-select :items="faculties"
                    v-model="facultyID"
                    label="Факультет">
          </v-select>
          <v-layout row>
            <v-flex xs4 class="mr-5">
              <v-select v-if="facultyID !== null"
                        :items="departments"
                        v-model="departmentID"
                        label="Кафедра">
              </v-select>
            </v-flex>
            <v-flex xs4 class="mr-5">
              <v-select v-if="facultyID !== null"
                        :items="groups"
                        v-model="groupID"
                        label="Группа">
              </v-select>
            </v-flex>
            <v-flex xs4>
              <v-select v-if="facultyID !== null"
                        :items="specialties"
                        v-model="specialtyID"
                        label="Специальности">
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
                      :return-value.sync="startDate"
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
                  <v-btn flat color="primary" @click="$refs.menu.save(startDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
            <v-flex xs6>
              <v-menu ref="menu2"
                      :close-on-content-click="false"
                      v-model="finishDateMenu"
                      :nudge-right="40"
                      :return-value.sync="finishDate"
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
                  <v-btn flat color="primary" @click="$refs.menu2.save(finishDate)">OK</v-btn>
                </v-date-picker>
              </v-menu>
            </v-flex>
          </v-layout>
          <v-flex xs12>
            <v-textarea v-if="facultyID !== null && specialtyID !== null"
              solo
              name="text-before"
              label="Текст перед наказом"
              :value="textbeforeAPP"
              v-model="textbefore"
            ></v-textarea>
          </v-flex>
          <v-flex xs12>
            <v-textarea v-if="facultyID !== null && departmentID !== null"
              solo
              name="text-before"
              label="Текст після наказу"
              :value="textafterAPP"
              v-model="textafter"
            ></v-textarea>
          </v-flex>
          <v-flex xs12>
            <v-data-table v-model="selected"
                          :headers="headers"
                          :items="selectedStudents"
                          :pagination.sync="pagination"
                          select-all
                          item-key="fio"
                          class="elevation-1">
              <template slot="headers" slot-scope="props">
                <tr>
                  <th>
                    <v-checkbox :input-value="props.all"
                                :indeterminate="props.indeterminate"
                                primary
                                hide-details
                                @click.native="toggleAll">
                    </v-checkbox>
                  </th>
                  <th v-for="header in props.headers"
                      :key="header.text"
                      :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                      @click="changeSort(header.value)">
                    <v-icon small>arrow_upward</v-icon>
                    {{ header.text }}
                  </th>
                </tr>
              </template>
              <template slot="items" slot-scope="props">
                <tr :active="props.selected" @click="props.selected = !props.selected">
                  <td>
                    <v-checkbox :input-value="props.selected"
                                primary
                                hide-details>
                    </v-checkbox>
                  </td>
                  <td class="text-xs-left">{{ props.item.fio }}</td>
                  <td class="text-xs-right">{{ getGroupName(props.item.groupID) }}</td>
                  <td class="text-xs-right">{{ props.item.groupCourse }}</td>
                  <td class="text-xs-right">{{ props.item.groupNumber }}</td>
                  <td class="text-xs-right">{{ props.item.practicePlace }}</td>
                  <td class="text-xs-right">{{ props.item.practiceLeader }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <v-btn :disabled="!facultyID"
                  class="success mb-3"
                  @click="createApplication()">
              Создать «Наказ»
          </v-btn>
          <StudentsTable />
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import StudentsTable from './components/StudentsTable'

export default {
  components: {
    StudentsTable
  },
  data () {
    return {
      facultyID: null,
      departmentID: null,
      groupID: null,
      specialtyID: null,
      groupCourse: '',
      groupNumber: '',
      groupTeh: false,
      startDate: '',
      finishDate: '',
      startDateMenu: false,
      finishDateMenu: false,
      textbefore: '',
      textafter: '',
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      headers: [
        {
          text: 'Ф.И.О',
          align: 'left',
          sortable: false,
          value: 'fio'
        },
        { text: 'Группа', value: 'groupID' },
        { text: 'Курс', value: 'groupCourse' },
        { text: 'Номер группы', value: 'groupNumber' },
        {
          text: 'Предприятие',
          value: 'place',
          sortable: true
        },
        {
          text: 'Руководитель',
          value: 'leader',
          sortable: true
        }
      ]
    }
  },
  computed: {
    students () {
      return this.$store.getters.students.map(student => {
        return {
          id: student.id,
          fio: student.fio,
          facultyID: student.facultyID,
          groupID: student.groupID,
          specialtyID: student.specialtyID,
          groupCourse: student.groupCourse,
          groupNumber: student.groupNumber,
          groupTeh: student.groupTeh,
          level: student.level,
          studyForm: student.studyForm,
          financing: student.financing,
          startDate: student.startDate,
          practicePlace: student.practicePlace,
          practiceLeader: student.practiceLeader
        }
      })
    },
    selectedStudents () {
      let sorted = this.students
      if (this.facultyID) {
        sorted = sorted.filter(student => {
          return student.facultyID === this.facultyID
        })
      }
      // if (this.departmentID) {
      //   sorted = sorted.filter(student => {
      //     return student.specialtyID === this.departmentID
      //   })
      // }
      if (this.groupID) {
        sorted = sorted.filter(student => {
          return student.groupID === this.groupID
        })
        if (this.groupCourse.length !== 0) {
          sorted = sorted.filter(student => {
            return student.groupCourse === this.groupCourse
          })
          if (this.groupNumber.length !== 0) {
            sorted = sorted.filter(student => {
              return student.groupNumber === this.groupNumber
            })
          }
        }
      }
      return sorted
    },
    textbeforeAPP () {
      return `Згідно з навчальним  планом підготовки фахівців ОР «Бакалавр» напряму ${this.specialty.code} «${this.specialty.name}» ${this.faculty.name} та графіку навчального процесу на ${new Date().getFullYear()}-${new Date().getFullYear() + 1} н.р.`
    },
    textafterAPP () {
      return `1.Направити студентів третього курсу на переддипломну практику студентів, що виконують дипломну роботу по кафедрі ${this.department.name.toLowerCase()}.`
    },
    specialty () {
      return this.specialtyID !== null ? this.$store.getters.getSpecialtyById(this.specialtyID) : {code: '', name: ''}
    },
    faculty () {
      return this.facultyID !== null ? this.$store.getters.getFacultiesById(this.facultyID) : {name: ''}
    },
    department () {
      return this.departmentID !== null ? this.$store.getters.getDepartmentById(this.departmentID) : {name: '', chief: ''}
    },
    group () {
      return this.groupID !== null ? this.$store.getters.getGroupById(this.groupID) : {alias: '', facultyID: null}
    },
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
    groupsLibrary () {
      return this.$store.getters.groups
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
    magister () {
      return this.groupCourse > 4
    }
  },
  methods: {
    getGroupName (groupID) {
      if (groupID !== null) {
        const group = this.groupsLibrary.find(group => {
          return group.id === groupID
        })
        return group.alias
      } else {
        return 'Без группы'
      }
    },
    toggleAll () {
      if (this.selected.length) this.selected = []
      else this.selected = this.students.slice()
    },
    changeSort (column) {
      if (this.pagination.sortBy === column) {
        this.pagination.descending = !this.pagination.descending
      } else {
        this.pagination.sortBy = column
        this.pagination.descending = false
      }
    },
    createApplication () {
      // TODO
    },
    formatDate (date) {
      const created = new Date(date)
      const day = created.getDate() < 10 ? '0' + created.getDate() : created.getDate()
      const month = (created.getMonth() + 1) < 10 ? '0' + (created.getMonth() + 1) : created.getMonth() + 1
      const year = created.getFullYear()
      return `${day}.${month}.${year}`
    },
    formatName (name) {
      const nameArr = name.split(' ')
      return `${nameArr[0]} ${nameArr[1].charAt(0)}. ${nameArr[2].charAt(0)}.`
    },
    formatNameReverse (name) {
      const nameArr = name.split(' ')
      return `${nameArr[1].charAt(0)}. ${nameArr[2].charAt(0)}. ${nameArr[0]}`
    }
  },
  watch: {
    textbeforeAPP () {
      this.textbefore = this.textbeforeAPP
    },
    textafterAPP () {
      this.textafter = this.textafterAPP
    },
    facultyID () {
      this.departmentID = null
      this.groupID = null
      this.groupCourse = ''
      this.groupNumber = ''
    }
  }
}
</script>
<style lang="scss" scoped
</style>
