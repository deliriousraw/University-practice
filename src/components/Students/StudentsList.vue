<template>
  <v-container>
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
        <v-select v-if="facultyID !== null"
                  :items="groupsLibrary"
                  v-model="groupID"
                  label="Группа">
        </v-select>
      </v-flex>
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
    </v-layout>
    <v-layout row>
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
            :items="sortedStudents"
            :search="search">

            <template slot="items" slot-scope="props">
              <td>{{ props.item.fio }}</td>
              <td>{{ getGroupName(props.item.groupID)}}</td>
              <td>{{ props.item.groupCourse === null || props.item.groupCourse.length === 0 ? '—' : props.item.groupCourse }}</td>
              <td>{{ props.item.groupNumber === null || props.item.groupNumber.length === 0 ? '—' : props.item.groupNumber}}</td>
              <td>{{ props.item.practicePlace === null || props.item.practicePlace.length === 0 ? '—' : props.item.practicePlace}}</td>
              <td>{{ props.item.practiceLeader === null || props.item.practiceLeader.length === 0 ? '—' : props.item.practiceLeader}}</td>
              <td class="text-xs-right">
                <EditStudent :student="props.item" class="mb-3"></EditStudent>
              </td>
            </template>
            <v-alert slot="no-results" :value="true" color="error" icon="warning">
              По Вашему поиску "{{ search }}" ничего не   найдено.
            </v-alert>
          </v-data-table>
        </v-card>
        <!-- ФУНКЦИЯ ДЛЯ НАЗНАЧЕНИЯ ГРУППЫ  -->
        <!-- <v-btn  class="success mb-3"
                :disabled="!this.facultyID"
                @click="setGroups">
              Добавить в группы
        </v-btn> -->
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import EditStudent from './EditStudent'
// import groupToSet from '../../../static/students/ftit/json/УТ-3-2-Т.json'

export default {
  components: {
    EditStudent
  },
  data () {
    return {
      facultyID: null,
      groupID: null,
      specialtyID: null,
      groupCourse: '',
      groupNumber: '',
      search: '',
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
        },
        { text: 'Действия', value: 'actions', sortable: false, align: 'right' }
      ],
      practicePlaces: ['КІСТ НТУ'],
      practiceLeaders: []
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
    sortedStudents () {
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
            return student.groupCourse === Number(this.groupCourse)
          })
          if (this.groupNumber.length !== 0) {
            sorted = sorted.filter(student => {
              return student.groupNumber === Number(this.groupNumber)
            })
          }
        }
      }
      return sorted
    },
    faculties () {
      let faculties = this.$store.getters.faculties.map(faculty => {
        return {
          text: faculty.name,
          value: faculty.id
        }
      })
      faculties.push({
        text: `Без факультета`,
        value: null
      })
      return faculties
    },
    groups () {
      return this.$store.getters.groups
    },
    groupsLibrary () {
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
    sortedGroups () {
      return this.groups.filter(group => {
        return group.facultyId === this.facultyID
      })
    },
    specialties () {
      let specialties = this.$store.getters.specialties.map(specialty => {
        return {
          text: `${specialty.code} ${specialty.name}`,
          value: specialty.id
        }
      })
      specialties.push({
        text: `Без специальности`,
        value: null
      })
      return specialties
    }
  },
  methods: {
    // setGroups () {
    //   const formatedGroupToSet = groupToSet.students.map(student => {
    //     const studentGroup = student.group.trim().split('-')
    //     return {
    //       name: student.name.trim().split(/[ ]+/g).join(' '),
    //       group_alias: studentGroup[0],
    //       group_course: Number(studentGroup[1]),
    //       group_number: Number(studentGroup[2]),
    //       group_teh: Boolean(studentGroup[3])
    //     }
    //   })
    //   console.log('STUDENTS FROM FILE', formatedGroupToSet)

    //   const notFindedinFIREBASE = formatedGroupToSet.filter(student => {
    //     return !Boolean(this.students.find((globalStudent) => {
    //       return globalStudent.fio === student.name
    //     }))
    //   })
    //   console.log('NOT finded in Firebase', notFindedinFIREBASE)

    //   let studentWithNewData = []
    //   this.students.forEach(student => {
    //     const studentData = formatedGroupToSet.find((formatedStudent) => {
    //       return student.fio.toLowerCase() === formatedStudent.name.toLowerCase() && student.groupID === null
    //     })
    //     if (studentData) {
    //       studentWithNewData.push({
    //         ...student,
    //         groupID: this.findGroup(studentData.group_alias),
    //         groupCourse: studentData.group_course,
    //         groupNumber: studentData.group_number,
    //         groupTeh: studentData.group_teh
    //       })
    //     }
    //   })
    //   console.log('Array with updated INFO', studentWithNewData)
    //   studentWithNewData.forEach(student => {
    //     this.$store.dispatch('updateStudent', student)
    //   })
    // },
    // findGroup (alias) {
    //   const findedGroup = this.sortedGroups.find((group) => {
    //     return group.alias === alias
    //   })
    //   return findedGroup.id ? findedGroup.id : null
    // },
    getGroupName (groupID) {
      if (groupID !== null) {
        const group = this.groups.find(group => {
          return group.id === groupID
        })
        return group.alias
      } else {
        return 'Без группы'
      }
    }
  }
}
</script>
