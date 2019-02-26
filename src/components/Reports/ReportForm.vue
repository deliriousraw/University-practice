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
              <v-combobox v-if="facultyID !== null"
                          v-model="groupID"
                          :items="groups"
                          label="Группа">
              </v-combobox>
            </v-flex>
            <v-flex xs4>
              <v-text-field v-if="facultyID !== null"
                            name="practiceDuration"
                            label="Продолжительность практики"
                            type="text"
                            v-model="practiceDuration">
              </v-text-field>
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
            <v-data-table v-if="groupID !== null && groupCourse !== '' && groupNumber !== ''"
                          v-model="selected"
                          :headers="headers"
                          :items="selectedStudents"
                          :pagination.sync="pagination"
                          select-all
                          item-key="fio"
                          class="elevation-1">
              <template slot="items" slot-scope="props">
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
                  <td>{{ props.item.fio }}</td>
                  <td>{{ getGroupName(props.item.groupID) }}</td>
                  <td>{{ props.item.groupCourse }}</td>
                  <td>{{ props.item.groupNumber }}</td>
                  <td>{{ props.item.practicePlace }}</td>
                  <td>{{ props.item.practiceLeader }}</td>
                </tr>
              </template>
            </v-data-table>
          </v-flex>
          <StudentsTable  v-if="!isInvalid" 
                          :faculty="faculty"
                          :department="department"
                          :group="groupForApplication"
                          :startDate="startDate"
                          :finishDate="finishDate" 
                          :students="studentsToReport"
                          :practiceDuration="practiceDuration" />
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
      groupCourse: '',
      groupNumber: '',
      groupTeh: false,
      startDate: '',
      finishDate: '',
      startDateMenu: false,
      finishDateMenu: false,
      passedStudents: [],
      practiceDuration: '',
      pagination: {
        sortBy: 'name'
      },
      selected: [],
      headers: [
        {
          text: 'Ф.И.О',
          align: 'left',
          sortable: true,
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
    isInvalid () {
      return this.facultyID === null || this.departmentID === null || this.groupID === null ||
      !this.groupCourse || !this.groupNumber || !this.startDate || !this.finishDate || !this.studentsToReport.length
    },
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
      if (this.groupID) {
        sorted = sorted.filter(student => {
          return student.groupID === this.groupID
        })
        if (this.groupCourse.length !== 0) {
          sorted = sorted.filter(student => {
            return student.groupCourse === Number(this.groupCourse)
          })
          if (this.groupNumber.length !== 0) {
            sorted = sorted.filter(student => {
              return student.groupNumber === Number(this.groupNumber)
            })
          }
          sorted = sorted.filter(student => {
            return student.groupTeh === this.groupTeh
          })
        }
      }
      return sorted
    },
    studentsToReport () {
      const allStudents = this.selectedStudents.slice()
      return allStudents.map(student => {
        if (this.selected.length && this.selected.some(selectedStudent => {
          return selectedStudent.id === student.id
        })) {
          return {
            ...student,
            practieStatus: true
          }
        } else {
          return {
            ...student,
            practieStatus: false
          }
        }
      })
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
      let filteredDepartments = []
      if (this.facultyID !== 'H8puzgFjjk2npeeda1UZ' && this.facultyID !== 'PTOfU3alUH3BKseCWHHt') {
        filteredDepartments = this.$store.getters.departments.filter((department) => {
          return department.facultyId === this.facultyID
        })
      } else {
        filteredDepartments = this.$store.getters.departments
      }
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
    isMasters () {
      return Number(this.groupCourse) > 4
    },
    groupForApplication () {
      return this.isMasters ? `${this.group.alias}-${Number(this.groupCourse) - 4}-${this.groupNumber}м.` : `${this.group.alias}-${this.groupCourse}-${this.groupNumber}${this.groupTeh ? '-тех.' : ''}`
    }
  },
  methods: {
    deleteItem (item) {
      const index = this.selectedStudents.indexOf(item)
      console.log(this.selectedStudents.splice(index, 1))
      confirm('Вы уверены что хотите убрать студента из отчёта ?') && this.selectedStudents.splice(index, 1)
    },
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
    }
  },
  watch: {
    facultyID () {
      this.departmentID = null
      this.groupID = null
      this.groupCourse = ''
      this.groupNumber = ''
      this.groupTeh = false
    }
  }
}
</script>
<style lang="scss" scoped
</style>
