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
    findUserThatNotInDB () {
      const uploadedUsers = this.$store.getters.students
      const notINBASE = this.dataFromJson.filter((student) => {
        return !(uploadedUsers.some(uploadedStudent => uploadedStudent.fio === student.fio.trim()))
      })
      const notIN = notINBASE.filter(student => !(student.fio.includes('`')))
      alert(notIN)
    },
    uploadStudents () {
      this.dataFromJson.forEach((student, index) => {
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

        const studentInfo = {
          fio: student.fio,
          facultyID: realFacultyID.id,
          groupID: null,
          specialtyID: realspecialtyID,
          groupCourse: '',
          groupNumber: '',
          practicePlace: '',
          practiceLeader: '',
          groupTeh: isGroupTech,
          level: student.level,
          studyForm: student.studyForm,
          financing: student.financing,
          startDate: realDay
        }
        this.$store.dispatch('createStudent', studentInfo)
      })
      // console.log('studentsToUpload', studentsToUpload, this.studentsFromStore)

      // const resultred = studentsToUpload.filter(newStudent => !this.studentsFromStore.some(oldStudent => {
      //   if (oldStudent.fio === newStudent.fio && oldStudent.facultyID === newStudent.facultyID && oldStudent.specialtyID === newStudent.specialtyID && oldStudent.groupTeh === newStudent.groupTeh && oldStudent.startDate === newStudent.startDate) {
      //     return true
      //   }
      //   return false
      // }))

      // console.log('resultred', resultred)
    },
    checkUploadedStudents () {
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

        const studentInfo = {
          fio: student.fio,
          facultyID: realFacultyID.id,
          groupID: null,
          specialtyID: realspecialtyID,
          groupCourse: '',
          groupNumber: '',
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
    }
    // formatJson (text) {
    //   // preserve newlines, etc - use valid JSON
    //   const replacedText = text.replace(/\\n/g, "\\n")
    //     .replace(/\\'/g, "\\'")
    //     .replace(/\\"/g, '\\"')
    //     .replace(/\\&/g, "\\&")
    //     .replace(/\\r/g, "\\r")
    //     .replace(/\\t/g, "\\t")
    //     .replace(/\\b/g, "\\b")
    //     .replace(/\\f/g, "\\f")
    //   // // remove non-printable and other non-valid JSON chars
    //   return replacedText.replace(/[\u0000-\u0019]+/g, "")
    // }
  }

}
</script>

<style>

</style>
