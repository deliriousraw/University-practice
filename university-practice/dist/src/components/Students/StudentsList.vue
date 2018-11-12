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
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import EditStudent from './EditStudent'

export default {
  components: {
    EditStudent
  },
  data () {
    return {
      facultyID: null,
      specialtyID: null,
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
      let sortedStudents = this.students
      if (this.facultyID !== null) {
        sortedStudents = sortedStudents.filter(student => {
          return student.facultyID === this.facultyID
        })
      } else if (this.specialtyID !== null) {
        sortedStudents = sortedStudents.filter(student => {
          return student.specialtyID === this.specialtyID
        })
      }
      return sortedStudents
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
