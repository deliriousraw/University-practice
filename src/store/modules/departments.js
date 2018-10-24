import * as fb from 'firebase'

export default {
  state: {
    departments: []
  },
  mutations: {
    createDepartment (state, payload) {
      state.departments.push(payload)
    },
    loadDepartments (state, payload) {
      state.departments = payload
    }
  },
  actions: {
    async createDepartment ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        await fb.firestore().collection('departments').add(payload)
        commit('createDepartment', payload)
        commit('setLoading', false)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    },
    async fetchDepartments ({commit}, payload) {
      commit('clearError')
      commit('setLoading', true)
      try {
        let departments = []
        await fb.firestore().collection('departments').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            departments.push({
              id: doc.id,
              name: doc.data().name,
              chief: doc.data().chief,
              facultyId: doc.data().facultyId
            })
          })
        })
        commit('loadDepartments', departments)
      } catch (error) {
        commit('setLoading', false)
        commit('setError', error.message)
        throw error
      }
    }
  },
  getters: {
    departments (state) {
      return state.departments
    }
  }
}
