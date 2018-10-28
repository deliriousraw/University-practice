import * as fb from 'firebase'

export default {
  state: {
    students: []
  },
  mutations: {
    createStudent (state, payload) {
      state.students.push(payload)
    },
    loadStudents (state, payload) {
      state.students = payload
    },
    updateStudent (state, payload) {
      const editedStudent = state.students.find(student => {
        return student.id === payload.id
      })
      editedStudent.fio = payload.fio
      editedStudent.facultyID = payload.facultyID
      editedStudent.groupID = payload.groupID
      editedStudent.specialtyID = payload.specialtyID
      editedStudent.groupCourse = payload.groupCourse
      editedStudent.groupNumber = payload.groupNumber
      editedStudent.groupTeh = payload.groupTeh
      editedStudent.level = payload.level
      editedStudent.studyForm = payload.studyForm
      editedStudent.financing = payload.financing
      editedStudent.startDate = payload.startDate
    }
  },
  actions: {
    async createStudent ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const students = await fb.firestore().collection('students').add(payload)
        commit('createStudent', payload)
        commit('setLoading', false)
        console.log(students)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchStudents ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let students = []
        await fb.firestore().collection('students').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            students.push({
              id: doc.id,
              fio: doc.data().fio,
              facultyID: doc.data().facultyID,
              groupID: doc.data().groupID,
              specialtyID: doc.data().specialtyID,
              groupCourse: doc.data().groupCourse,
              groupNumber: doc.data().groupNumber,
              groupTeh: doc.data().groupTeh,
              level: doc.data().level,
              studyForm: doc.data().studyForm,
              financing: doc.data().financing,
              startDate: doc.data().startDate
            })
          })
        })
        commit('loadStudents', students)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async updateStudent ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.firestore().collection('students').doc(payload.id).set({
          fio: payload.fio,
          facultyID: payload.facultyID,
          groupID: payload.groupID,
          specialtyID: payload.specialtyID,
          groupCourse: payload.groupCourse,
          groupNumber: payload.groupNumber,
          groupTeh: payload.groupTeh,
          level: payload.level,
          studyForm: payload.studyForm,
          financing: payload.financing,
          startDate: payload.startDate
        })
        commit('updateStudent', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    students (state) {
      return state.students
    },
    getStudentById: state => id => {
      return state.students.find(student => student.id === id)
    }
  }
}
