<template>
  <v-container>
    <v-layout column>
      <v-flex xs12>
        <v-card-title>
          <h2 class="text-primary">Выберите файл с ГРУППАМИ студентов</h2>
        </v-card-title>
      </v-flex>

      <v-flex xs12>
        <v-btn class="warning" @click="triggerUpload">
          Загрузить
          <v-icon right dark>cloud_upload</v-icon>
          <input ref="fileInput" type="file" style="display: none;" accept=".json" @change="onFileChange">
        </v-btn>
      </v-flex>

      <v-layout column>
        <v-flex xs12>
          <v-select :items="faculties"
                    v-model="facultyID"
                    label="Факультет">
          </v-select>
        </v-flex>
        <v-layout>
          <v-flex xs6 class="mr-5">
            <v-switch :label="`Техникум`"
                      v-model="groupTeh">
            </v-switch>
          </v-flex>

          <v-flex xs6>
            <v-switch :label="`Магистры`"
                      v-model="magisters">
            </v-switch>
          </v-flex>
        </v-layout>

        <v-layout>
          <v-flex xs6>
            <v-btn  class="success mb-3"
                    v-if="facultyID && groupToSet"
                    @click="checkUploadedStudents">
                  ПРОВЕРИТЬ СТУДЕНТОВ - КОНСОЛЬ!
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn  class="success mb-3"
                    v-if="facultyID && groupToSet"
                    @click="setGroups">
                  НАЗНАЧИТЬ ГРУППЫ в firebase
            </v-btn>
          </v-flex>
          <!-- <v-flex xs6>
            <v-btn  class="success mb-3"
                    @click="deleteStudents">
                  УДАЛИТЬ ПРОШЛОГОДНИХ СТУДЕНТОВ
            </v-btn>
          </v-flex>
          <v-flex xs6>
            <v-btn  class="success mb-3"
                    @click="updateStudents">
                  ДОБАВИТЬ ГОД ПРОШЛОГОДНИМ СТУДЕНТАМ
            </v-btn>
          </v-flex> -->
        </v-layout>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
// import studData from '../../../students.json'

export default {
  name: 'AssignGroup',
  data () {
    return {
      groupToSet: null,
      facultyID: null,
      groupTeh: false,
      magisters: false
    }
  },
  mounted () {
    if (confirm('Загрузить всех студентов?')) {
      localStorage.clear()
      this.$store.dispatch('fetchALLStudents')
    }
  },
  computed: {
    // dataFromJson () {
    //   return studData
    // },
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
    sortedGroups () {
      return this.groups.filter(group => {
        return group.facultyId === this.facultyID
      })
    }
  },
  methods: {
    triggerUpload () {
      this.$refs.fileInput.click()
    },
    saveStudentsToJson () {
      console.log(JSON.stringify(this.$store.getters.students, null, 2))
    },
    // async deleteStudents () {
    //   const bachelorsToDelete = this.students.filter(student => student.groupTeh === false && student.groupCourse === 4)
    //   const techStudentsToDelete = this.students.filter(student => student.groupTeh === true && student.groupCourse === 3)

    //   const studentsToDelete = bachelorsToDelete.concat(techStudentsToDelete)

    //   for (let i = 0; i < studentsToDelete.length; i++) {
    //     try {
    //       await this.$store.dispatch('deleteStudent', studentsToDelete[i])
    //     } catch (e) {
    //       console.log(e, studentsToDelete[i])
    //     }
    //   }
    // },
    // async updateStudents () {
    //   const bachelorsToUpdate = this.dataFromJson.filter(student => student.groupTeh === false && student.groupCourse < 4)
    //   const techStudentsToUpdate = this.dataFromJson.filter(student => student.groupTeh === true && student.groupCourse < 3)

    //   const studentsToUpdate = bachelorsToUpdate.concat(techStudentsToUpdate)
    //   const studentsWithUpdatedInfo = studentsToUpdate.map(student => {
    //     if (student.groupCourse !== '' && typeof student.groupCourse === 'number') {
    //       return {
    //         ...student,
    //         groupCourse: student.groupCourse + 1
    //       }
    //     }
    //     return student
    //   })

    //   for (let i = 0; i < studentsWithUpdatedInfo.length; i++) {
    //     await this.$store.dispatch('updateStudent', studentsWithUpdatedInfo[i])
    //   }
    // },
    onFileChange (event) {
      const file = event.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          this.groupToSet = json
        } catch (error) {
          alert('ERROR when trying to parse json = ' + error)
        }
      }
      reader.readAsText(file)
    },
    setGroups () {
      const formatedGroupToSet = this.groupToSet.map(student => {
        const studentGroup = student.group.trim().split('-')
        return {
          name: student.name.trim().split(/[ ]+/g).join(' '),
          group_alias: studentGroup[0],
          group_course: this.magisters ? Number(studentGroup[1]) + 4 : Number(studentGroup[1]),
          group_number: Number(studentGroup[2]),
          group_teh: Boolean(studentGroup[3]) || this.groupTeh
        }
      })
      console.log('STUDENTS FROM FILE', formatedGroupToSet)

      const notFindedinFIREBASE = formatedGroupToSet.filter(student => {
        return !(this.students.find((globalStudent) => {
          return globalStudent.fio.trim() === student.name
        }))
      })
      console.log('NOT finded in Firebase', notFindedinFIREBASE)

      let studentWithNewData = []
      this.students.forEach(student => {
        const studentData = formatedGroupToSet.find((formatedStudent) => {
          return student.fio.toLowerCase().trim() === formatedStudent.name.toLowerCase() && student.groupID === null
        })
        if (studentData) {
          studentWithNewData.push({
            ...student,
            groupID: this.findGroup(studentData.group_alias),
            groupCourse: studentData.group_course,
            groupNumber: studentData.group_number,
            groupTeh: studentData.group_teh
          })
        }
      })
      console.log('Array with updated INFO', studentWithNewData)
      studentWithNewData.forEach(student => {

      })
    },
    findGroup (alias) {
      const findedGroup = this.sortedGroups.find((group) => {
        return group.alias === alias
      })
      return findedGroup.id ? findedGroup.id : null
    },
    checkUploadedStudents () {
      console.log('ok', this.groupToSet)
      const formatedGroupToSet = this.groupToSet.map(student => {
        const studentGroup = student.group.trim().split('-')
        return {
          name: student.name.trim().split(/[ ]+/g).join(' '),
          group_alias: studentGroup[0],
          group_course: this.magisters ? Number(studentGroup[1]) + 4 : Number(studentGroup[1]),
          group_number: Number(studentGroup[2]),
          group_teh: Boolean(studentGroup[3]) || this.groupTeh
        }
      })
      console.log('STUDENTS FROM FILE', formatedGroupToSet)

      const notFindedinFIREBASE = formatedGroupToSet.filter(student => {
        return !(this.students.find((globalStudent) => {
          return globalStudent.fio.trim() === student.name
        }))
      })
      console.log('NOT finded in Firebase', notFindedinFIREBASE)

      let studentWithNewData = []
      this.students.forEach(student => {
        const studentData = formatedGroupToSet.find((formatedStudent) => {
          return student.fio.toLowerCase().trim() === formatedStudent.name.toLowerCase() && student.groupID === null
        })
        if (studentData) {
          studentWithNewData.push({
            ...student,
            groupID: this.findGroup(studentData.group_alias),
            groupCourse: studentData.group_course,
            groupNumber: studentData.group_number,
            groupTeh: studentData.group_teh
          })
        }
      })
      console.log('Array with updated INFO', studentWithNewData)
    }
  }
}
</script>

<style>

</style>
