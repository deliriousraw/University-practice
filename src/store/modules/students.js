import firebase from 'firebase/app'

export default {
  state: {
    students: [],
    requests: []
  },
  mutations: {
    initialiseStore (state) {
      if (localStorage.getItem('store')) {
        Object.assign(state.students, JSON.parse(localStorage.getItem('store')))
      }
      if (localStorage.getItem('requests')) {
        Object.assign(state.requests, JSON.parse(localStorage.getItem('requests')))
      }
    },
    createStudent (state, payload) {
      state.students.push(payload)
    },
    addRequest (state, payload) {
      state.requests.push(payload)
    },
    loadStudents (state, payload) {
      state.students = [...state.students, ...payload]
    },
    loadAllStudents (state, payload) {
      state.students = payload
    },
    clearStorage (state, payload) {
      state.students = []
      state.requests = []
    },
    updateStudent (state, payload) {
      const editedStudent = state.students.find(student => {
        return student.id === payload.id
      })
      if (editedStudent) {
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
        editedStudent.practicePlace = payload.practicePlace
        editedStudent.practiceLeader = payload.practiceLeader
      }
    },
    deleteStudent (state, payload) {
      state.students = state.students.filter(student => student.id !== payload.id)
    },
    updatePracticeLeaders (state, payload) {
      payload.forEach((studentToUpdate) => {
        const editedStudent = state.students.find(student => {
          return student.id === studentToUpdate.id
        })
        editedStudent.practiceLeader = studentToUpdate.practiceLeader
      })
    }
  },
  actions: {
    async createStudent ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        const students = await firebase.firestore().collection('students').add(payload)
        commit('createStudent', payload)
        commit('setLoading', false)
        console.log(students)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async deleteStudent ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await firebase.firestore().collection('students').doc(payload.id).delete()
        console.log('deleted', payload.id)
        commit('deleteStudent', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchStudents ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      commit('addRequest', payload)
      try {
        let students = []
        await firebase.firestore().collection('students')
          .where('facultyID', '==', payload.facultyID)
          .where('groupID', '==', payload.groupID)
          .where('groupCourse', '==', Number(payload.groupCourse))
          .where('groupNumber', '==', Number(payload.groupNumber))
          .where('groupTeh', '==', payload.groupTeh)
          .get().then((querySnapshot) => {
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
                startDate: doc.data().startDate,
                practicePlace: doc.data().practicePlace,
                practiceLeader: doc.data().practiceLeader
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
    async fetchALLStudents ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let students = []
        await firebase.firestore().collection('students').get().then((querySnapshot) => {
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
              startDate: doc.data().startDate,
              practicePlace: doc.data().practicePlace,
              practiceLeader: doc.data().practiceLeader
            })
          })
        })
        localStorage.setItem('store', JSON.stringify(students))
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
        await firebase.firestore().collection('students').doc(payload.id).set({
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
          startDate: payload.startDate,
          practicePlace: payload.practicePlace,
          practiceLeader: payload.practiceLeader
        })
        console.log('updated', payload.id)
        commit('updateStudent', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async updatePracticeLeaders ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await payload.forEach((student) => {
          firebase.firestore().collection('students').doc(student.id).update({
            practiceLeader: student.practiceLeader
          })
        })
        commit('updatePracticeLeaders', payload)
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
    },
    requests (state) {
      return state.requests
    }
  }
}
