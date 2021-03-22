<template>
  <v-container>
    <v-layout column>
      <v-flex xs12>
        <v-card-title>
          <h2 class="text-primary">Выберите файл студентов</h2>
        </v-card-title>
      </v-flex>
      <v-flex xs12>
        <v-btn class="warning" @click="triggerUpload">
          Загрузить
          <v-icon right dark>cloud_upload</v-icon>
          <input ref="fileInput" type="file" style="display: none;" accept=".json" @change="onFileChange">
        </v-btn>
      </v-flex>
      <v-layout row>
        <v-flex xs6>
          <v-btn  class="success mb-3"
                  v-if="dataFromJson !== null"
                  @click="checkUploadedStudents">
                ПРОВЕРИТЬ СТУДЕНТОВ - КОНСОЛЬ!
          </v-btn>
        </v-flex>
        <v-flex xs6>
          <v-btn  class="success mb-3"
                  v-if="dataFromJson !== null"
                  @click="uploadStudents">
                Добавить в firebase
          </v-btn>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script>
import studGroups from './students.json'

export default {
  name: 'UploadStudents',
  data () {
    return {
      dataFromJson: null
    }
  },
  computed: {
    studentsFromStore () {
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
    }
  },
  methods: {
    triggerUpload () {
      this.$refs.fileInput.click()
    },
    onFileChange (event) {
      const file = event.target.files[0]

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result)
          this.dataFromJson = json
        } catch (error) {
          alert('ERROR when trying to parse json = ' + error)
        }
      }
      reader.readAsText(file)
    },
    async findUserThatNotInDB () {
      const uploadedUsers = this.$store.getters.students
      const notINBASE = this.dataFromJson.filter((student) => {
        return !(uploadedUsers.some(uploadedStudent => uploadedStudent.fio.trim() === student.fio.trim()))
      })

      const newUploadedUsers = notINBASE.map((student, index) => {
        const studentStartDate = student.startdate.split('/')
        const month = studentStartDate[0] < 10 ? '0' + studentStartDate[0] : studentStartDate[0]
        const day = studentStartDate[1] < 10 ? '0' + studentStartDate[1] : studentStartDate[1]
        const year = '20' + studentStartDate[2]
        const realDay = `${year}-${month}-${day}`

        const realspecialty = this.$store.getters.specialties.find(speciality => {
          const splittedSpecialty = student.speciality.split(' ')
          return speciality.code === splittedSpecialty[0]
        })
        const realspecialtyID = realspecialty ? realspecialty.id : null

        const realFacultyID = this.$store.getters.faculties.find(faculty => {
          return faculty.name === student.department
        })
        const isGroupTech = student.isShortTerm === 'Так'
        const realCourse = Number(student.course)

        const data = studGroups.find((item) => item.fio.trim() === student.fio.trim())

        let group = ''
        let groupNumber = ''
        if (data) { 
            const groupItem = this.$store.getters.groups.find(group => {
                return group.facultyId === realFacultyID.id && group.alias === data.alias
            })
            group = groupItem && groupItem.id || null
            groupNumber = Number(data.groupNumber) || ''
        }

        const studentInfo = {
          fio: student.fio,
          facultyID: realFacultyID.id,
          groupID: group,
          specialtyID: realspecialtyID,
          groupCourse: realCourse,
          groupNumber: groupNumber,
          practicePlace: '',
          practiceLeader: '',
          groupTeh: isGroupTech,
          level: student.level,
          studyForm: student.studyForm,
          financing: student.financing,
          startDate: realDay
        }
        return studentInfo
      })
      console.log(newUploadedUsers)
      for (let i = 0; i < newUploadedUsers.length; i++) {
        await this.$store.dispatch('createStudent', newUploadedUsers[i])
        console.log('ok')
      }
    },
    async uploadStudents () {
        const uploadedUsers = this.dataFromJson.map((student, index) => {
        const studentStartDate = student.startdate.split('/')
        const month = studentStartDate[0] < 10 ? '0' + studentStartDate[0] : studentStartDate[0]
        const day = studentStartDate[1] < 10 ? '0' + studentStartDate[1] : studentStartDate[1]
        const year = '20' + studentStartDate[2]
        const realDay = `${year}-${month}-${day}`

        const realspecialty = this.$store.getters.specialties.find(speciality => {
          const splittedSpecialty = student.speciality.split(' ')
          return speciality.code === splittedSpecialty[0]
        })
        const realspecialtyID = realspecialty ? realspecialty.id : null

        const realFacultyID = this.$store.getters.faculties.find(faculty => {
          return faculty.name === student.department
        })
        const isGroupTech = student.isShortTerm === 'Так'
        const realCourse = Number(student.course)

        const data = studGroups.find((item) => item.fio.trim() === student.fio.trim())

        let group = ''
        let groupNumber = ''
        if (data) { 
            const groupItem = this.$store.getters.groups.find(group => {
                return group.facultyId === realFacultyID.id && group.alias === data.alias
            })
            group = groupItem && groupItem.id || null
            groupNumber = Number(data.groupNumber) || ''
        }

        const studentInfo = {
          fio: student.fio,
          facultyID: realFacultyID.id,
          groupID: group,
          specialtyID: realspecialtyID,
          groupCourse: realCourse,
          groupNumber: groupNumber,
          practicePlace: '',
          practiceLeader: '',
          groupTeh: isGroupTech,
          level: student.level,
          studyForm: student.studyForm,
          financing: student.financing,
          startDate: realDay
        }
        return studentInfo
      })
      console.log(uploadedUsers)
      for (let i = 0; i < uploadedUsers.length; i++) {
        await this.$store.dispatch('createStudent', uploadedUsers[i])
        console.log('ok')
      }
    },
    checkUploadedStudents () {
      const notFounded = []
      const uploadedUsers = this.dataFromJson.map((student, index) => {
        const studentStartDate = student.startdate.split('/')
        const month = studentStartDate[0] < 10 ? '0' + studentStartDate[0] : studentStartDate[0]
        const day = studentStartDate[1] < 10 ? '0' + studentStartDate[1] : studentStartDate[1]
        const year = '20' + studentStartDate[2]
        const realDay = `${year}-${month}-${day}`

        const realspecialty = this.$store.getters.specialties.find(speciality => {
          const splittedSpecialty = student.speciality.split(' ')
          return speciality.code === splittedSpecialty[0]
        })
        const realspecialtyID = realspecialty ? realspecialty.id : null

        const realFacultyID = this.$store.getters.faculties.find(faculty => {
          return faculty.name === student.department
        })
        const isGroupTech = student.isShortTerm === 'Так'
        const realCourse = Number(student.course)

        const data = studGroups.find((item) => item.fio.trim() === student.fio.trim())

        let group = ''
        let groupNumber = ''
        if (data) { 
            const groupItem = this.$store.getters.groups.find(group => {
                return group.facultyId === realFacultyID.id && group.alias === data.alias
            })
            if (!groupItem) {
                notFounded.push(student)
            }
            group = groupItem && groupItem.id || null
            groupNumber = Number(data.groupNumber) || ''
        }

        const studentInfo = {
          fio: student.fio,
          facultyID: realFacultyID.id,
          groupID: group,
          specialtyID: realspecialtyID,
          groupCourse: realCourse,
          groupNumber: groupNumber,
          practicePlace: '',
          practiceLeader: '',
          groupTeh: isGroupTech,
          level: student.level,
          studyForm: student.studyForm,
          financing: student.financing,
          startDate: realDay
        }
        return studentInfo
      })
      console.log('Students to upload', uploadedUsers)
      console.log(JSON.stringify(notFounded, null, 2), notFounded.length)
    }
  }

}
</script>

<style>

</style>
